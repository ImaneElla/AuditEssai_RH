package com.premium.essai.service.impl;

import com.premium.essai.dto.DecisionRHRequestDTO;
import com.premium.essai.dto.EvaluationDetailRequestDTO;
import com.premium.essai.dto.EvaluationDetailResponseDTO;
import com.premium.essai.model.EvaluationDetail;
import com.premium.essai.model.PeriodeEvaluation;
import com.premium.essai.model.Salarie;
import com.premium.essai.model.enums.CibleRole;
import com.premium.essai.model.enums.RecommandationEvaluateur;
import com.premium.essai.model.enums.StatutEssai;
import com.premium.essai.model.enums.StatutPeriode;
import com.premium.essai.model.enums.PeriodeType;
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
                .orElseThrow(() -> new RuntimeException("Lien d'evaluation invalide ou expire."));

        if (LocalDate.now().isAfter(periode.getDateEcheance()) && periode.getStatut() != StatutPeriode.COMPLETEE) {
            throw new IllegalStateException("Le delai d'evaluation est depasse.");
        }

        EvaluationDetail detail = evaluationDetailRepository.findByPeriodeEvaluationId(periode.getId()).orElse(null);
        return detail != null ? mapToResponseDTO(detail) : null;
    }

    @Override
    @Transactional
    public EvaluationDetailResponseDTO soumettreEvaluation(Long periodeId, EvaluationDetailRequestDTO dto) {
        PeriodeEvaluation periode = periodeRepository.findById(periodeId)
                .orElseThrow(() -> new RuntimeException("Periode d'evaluation non trouvee ID: " + periodeId));

        Salarie salarie = periode.getSalarie();

        if (Boolean.TRUE.equals(salarie.getBloqueEmails()) || !Boolean.TRUE.equals(salarie.getActif())) {
            throw new IllegalStateException("Impossible d'evaluer un salarie inactif ou en rupture.");
        }

        if (LocalDate.now().isAfter(periode.getDateEcheance())) {
            throw new IllegalStateException("Le delai d'evaluation est depasse.");
        }

        double noteGlobale = (dto.getNoteCompetencesPro() + dto.getNoteAptitudesPerso() + dto.getNoteQSE()) / 3.0;

        EvaluationDetail detail = EvaluationDetail.builder()
                .periodeEvaluation(periode)
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

        if (recommandation == RecommandationEvaluateur.CONFIRMATION_CDI || recommandation == RecommandationEvaluateur.PROLONGATION_ESSAI) {
            if (periode.getTypePeriode() == PeriodeType.TROIS_MOIS) {
                PeriodeEvaluation p2 = PeriodeEvaluation.builder()
                        .salarie(salarie)
                        .responsable(salarie.getResponsable())
                        .typePeriode(PeriodeType.SIX_MOIS)
                        .dateEcheance(salarie.getDateEmbauche().plusMonths(6))
                        .statut(StatutPeriode.PLANIFIEE)
                        .tokenAccesSalarie(UUID.randomUUID().toString())
                        .build();
                periodeRepository.save(p2);
                log.info("Periode 2 (6 mois) generee automatiquement pour {}", salarie.getMatricule());
            } else {
                salarie.setStatutEssai(StatutEssai.VALIDE);
                salarieRepository.save(salarie);
            }
        } else if (recommandation == RecommandationEvaluateur.RUPTURE_CONTRAT) {
            salarie.setStatutEssai(StatutEssai.RUPTURE);
            salarie.setActif(false);
            salarie.setBloqueEmails(true);
            salarieRepository.save(salarie);
            log.warn("Arret du contrat pour {}. Emails bloques.", salarie.getMatricule());
        }

        String nomSalarie = salarie.getFirstName() + " " + salarie.getLastName();
        String nomManager = periode.getResponsable().getFirstName() + " " + periode.getResponsable().getLastName();

        notificationService.creerAlerte(
                "Evaluation completee : " + nomSalarie,
                "Le responsable " + nomManager + " a rempli l'evaluation. Decision : " + recommandation.name(),
                CibleRole.ALL_RH
        );

        mailService.sendNotificationFormulaireRempliAuxAdmins(periode);

        return mapToResponseDTO(savedDetail);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluationDetailResponseDTO getEvaluationByPeriodeId(Long periodeId) {
        EvaluationDetail detail = evaluationDetailRepository.findByPeriodeEvaluationId(periodeId)
                .orElseThrow(() -> new RuntimeException("Detail d'evaluation introuvable pour la periode ID: " + periodeId));
        return mapToResponseDTO(detail);
    }

    @Override
    @Transactional
    public void validerDecisionRH(Long periodeId, DecisionRHRequestDTO dto) {
        // Optionnel pour regularisation RH
    }

    @Override
    @Transactional
    public void priseDeDecisionDirecteRH(Long periodeId, DecisionRHRequestDTO dto) {
        PeriodeEvaluation periode = periodeRepository.findById(periodeId)
                .orElseThrow(() -> new RuntimeException("Periode d'evaluation non trouvee ID: " + periodeId));

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
                .periodeId(detail.getPeriodeEvaluation().getId())
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
