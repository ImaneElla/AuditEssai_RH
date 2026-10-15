package com.premium.essai.service.impl;

import com.premium.essai.dto.DecisionRHRequestDTO;
import com.premium.essai.dto.EvaluationDetailRequestDTO;
import com.premium.essai.dto.EvaluationDetailResponseDTO;
import com.premium.essai.entity.EvaluationDetail;
import com.premium.essai.entity.PeriodeEvaluation;
import com.premium.essai.entity.Salarie;
import com.premium.essai.enums.CibleRole;
import com.premium.essai.enums.RecommandationEvaluateur;
import com.premium.essai.enums.StatutEssai;
import com.premium.essai.enums.StatutPeriode;
import com.premium.essai.enums.TypePeriode;
import com.premium.essai.repository.EvaluationDetailRepository;
import com.premium.essai.repository.PeriodeEvaluationRepository;
import com.premium.essai.repository.SalarieRepository;
import com.premium.essai.service.EvaluationService;
import com.premium.essai.service.MailService;
import com.premium.essai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationServiceImpl implements EvaluationService {

    private final PeriodeEvaluationRepository periodeRepository;
    private final EvaluationDetailRepository evaluationDetailRepository;
    private final SalarieRepository salarieRepository;
    private final MailService mailService;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public EvaluationDetailResponseDTO getEvaluationByToken(String token) {
        PeriodeEvaluation periode = periodeRepository.findByTokenAccesSalarie(token)
                .orElseThrow(() -> new RuntimeException("Lien d'évaluation invalide ou expiré."));

        //  BLOCAGE STRICT J+1
        if (LocalDate.now().isAfter(periode.getDateEcheance()) && periode.getStatut() != StatutPeriode.COMPLETEE) {
            throw new IllegalStateException(
                "Le délai d'évaluation est dépassé. Ce dossier est sous le contrôle de la Direction RH. " +
                "Pour soumettre une évaluation tardive, veuillez contacter le pôle RH."
            );
        }

        EvaluationDetail detail = evaluationDetailRepository.findByPeriodeId(periode.getId()).orElse(null);
        return detail != null ? mapToResponseDTO(detail) : null;
    }

    @Override
    @Transactional
    public EvaluationDetailResponseDTO soumettreEvaluation(Long periodeId, EvaluationDetailRequestDTO dto) {
        PeriodeEvaluation periode = periodeRepository.findById(periodeId)
                .orElseThrow(() -> new RuntimeException("Période d'évaluation non trouvée ID: " + periodeId));

        Salarie salarie = periode.getSalarie();

        if (salarie.isBloqueEmails() || !salarie.isActif()) {
            throw new IllegalStateException("Impossible d'évaluer un salarié inactif ou en rupture/démission.");
        }

        //  BLOCAGE STRICT J+1
        if (LocalDate.now().isAfter(periode.getDateEcheance())) {
            throw new IllegalStateException(
                "Le délai d'évaluation est dépassé. Ce dossier est sous le contrôle de la Direction RH. " +
                "Pour soumettre une évaluation tardive, veuillez contacter le pôle RH."
            );
        }

        double noteGlobale = (dto.getNoteCompetencesPro() + dto.getNoteAptitudesPerso() + dto.getNoteQSE()) / 3.0;

        EvaluationDetail detail = EvaluationDetail.builder()
                .periode(periode)
                .noteCompetencesPro(dto.getNoteCompetencesPro())
                .noteAptitudesPerso(dto.getNoteAptitudesPerso())
                .noteQSE(dto.getNoteQSE())
                .noteGlobale(noteGlobale)
                .pointsForts(dto.getPointsForts())
                .axesAmelioration(dto.getAxesAmelioration())
                .commentairesEvaluateur(dto.getCommentairesEvaluateur())
                .recommandationEvaluateur(dto.getRecommandationEvaluateur())
                .jsonReponsesCriteres(dto.getJsonReponsesCriteres())
                .dateSoumission(LocalDate.now())
                .build();

        EvaluationDetail savedDetail = evaluationDetailRepository.save(detail);

        periode.setNoteGlobale(noteGlobale);
        periode.setDateValidationEvaluateur(LocalDate.now());
        periode.setStatut(StatutPeriode.COMPLETEE);
        periodeRepository.save(periode);

        RecommandationEvaluateur recommandation = dto.getRecommandationEvaluateur();

        // AUTOMATISATION DIRECTE
        if (recommandation == RecommandationEvaluateur.CONFIRMATION_CDI || recommandation == RecommandationEvaluateur.PROLONGATION_ESSAI) {
            
            if (periode.getTypePeriode() == TypePeriode.TROIS_MOIS) {
                // CASCADE AUTOMATIQUE : Génération instantanée de P2 (6 mois)
                PeriodeEvaluation p2 = PeriodeEvaluation.builder()
                        .salarie(salarie)
                        .responsable(salarie.getResponsable())
                        .typePeriode(TypePeriode.SIX_MOIS)
                        .dateEcheance(salarie.getDateEmbauche().plusMonths(6))
                        .statut(StatutPeriode.PLANIFIEE)
                        .tokenAccesSalarie(UUID.randomUUID().toString())
                        .build();

                periodeRepository.save(p2);
                log.info("Période 2 (6 mois) générée automatiquement pour {}", salarie.getMatricule());
            } else {
                salarie.setStatutEssai(StatutEssai.VALIDE);
                salarieRepository.save(salarie);
            }

        } else if (recommandation == RecommandationEvaluateur.RUPTURE_CONTRAT) {
            // RUPTURE : Blocage immédiat de tous les emails
            salarie.setStatutEssai(StatutEssai.RUPTURE);
            salarie.setActif(false);
            salarie.setBloqueEmails(true);
            salarieRepository.save(salarie);

            log.warn("Arrêt du contrat pour {}. Emails bloqués.", salarie.getMatricule());
        }

        String nomSalarie = salarie.getFirstName() + " " + salarie.getLastName();
        String nomManager = periode.getResponsable().getFirstName() + " " + periode.getResponsable().getLastName();

        notificationService.creerAlerte(
                "Évaluation complétée : " + nomSalarie,
                "Le responsable " + nomManager + " a rempli l'évaluation. Décision : " + recommandation.name(),
                CibleRole.ALL_RH
        );

        mailService.sendNotificationFormulaireRempliAuxAdmins(periode);

        return mapToResponseDTO(savedDetail);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluationDetailResponseDTO getEvaluationByPeriodeId(Long periodeId) {
        EvaluationDetail detail = evaluationDetailRepository.findByPeriodeId(periodeId)
                .orElseThrow(() -> new RuntimeException("Détail d'évaluation introuvable pour la période ID: " + periodeId));
        return mapToResponseDTO(detail);
    }

    @Override
    @Transactional
    public void validerDecisionRH(Long periodeId, DecisionRHRequestDTO dto) {
        // Optionnel pour régularisation RH
    }

    @Override
    @Transactional
    public void priseDeDecisionDirecteRH(Long periodeId, DecisionRHRequestDTO dto) {
        PeriodeEvaluation periode = periodeRepository.findById(periodeId)
                .orElseThrow(() -> new RuntimeException("Période d'évaluation non trouvée ID: " + periodeId));

        Salarie salarie = periode.getSalarie();
        periode.setNoteGlobale(3.0);
        periode.setDateValidationEvaluateur(LocalDate.now());
        periode.setStatut(StatutPeriode.COMPLETEE);

        if (dto.getDecisionFinale().name().equals("RUPTURE")) {
            salarie.setStatutEssai(StatutEssai.RUPTURE);
            salarie.setActif(false);
            salarie.setBloqueEmails(true);
            salarieRepository.save(salarie);
        }

        periodeRepository.save(periode);
    }

    private EvaluationDetailResponseDTO mapToResponseDTO(EvaluationDetail detail) {
        return EvaluationDetailResponseDTO.builder()
                .id(detail.getId())
                .periodeId(detail.getPeriode().getId())
                .noteCompetencesPro(detail.getNoteCompetencesPro())
                .noteAptitudesPerso(detail.getNoteAptitudesPerso())
                .noteQSE(detail.getNoteQSE())
                .noteGlobale(detail.getNoteGlobale())
                .pointsForts(detail.getPointsForts())
                .axesAmelioration(detail.getAxesAmelioration())
                .commentairesEvaluateur(detail.getCommentairesEvaluateur())
                .recommandationEvaluateur(detail.getRecommandationEvaluateur().name())
                .dateSoumission(detail.getDateSoumission())
                .jsonReponsesCriteres(detail.getJsonReponsesCriteres())
                .build();
    }
}