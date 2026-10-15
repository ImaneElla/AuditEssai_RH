package com.premium.essai.controller;

import com.premium.essai.dto.DashboardStatsResponseDTO;
import com.premium.essai.dto.HistoriqueEmailResponseDTO;
import com.premium.essai.model.HistoriqueEmail;
import com.premium.essai.model.enums.StatutPeriode;
import com.premium.essai.repository.HistoriqueEmailRepository;
import com.premium.essai.repository.PeriodeEvaluationRepository;
import com.premium.essai.repository.SalarieRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "4. Dashboard & KPIs RH", description = "APIs de pilotage et statistiques globales")
public class DashboardController {

    private final SalarieRepository salarieRepository;
    private final PeriodeEvaluationRepository periodeRepository;
    private final HistoriqueEmailRepository historiqueEmailRepository;

    @GetMapping("/stats")
    @Operation(summary = "Statistiques Dashboard RH")
    public ResponseEntity<DashboardStatsResponseDTO> getDashboardStats() {
        long totalSalariesActifs = salarieRepository.countByActifTrue();
        long totalEnCours = periodeRepository.countByStatut(StatutPeriode.EN_COURS);
        long totalEnRelance = periodeRepository.countByStatut(StatutPeriode.EN_RELANCE);
        long totalEnRetard = periodeRepository.countByStatut(StatutPeriode.EN_RETARD_CRITIQUE);
        long totalCompletees = periodeRepository.countByStatut(StatutPeriode.COMPLETEE);

        Map<String, Long> repartition = salarieRepository.findByActifTrue().stream()
                .filter(s -> s.getDirection() != null)
                .collect(Collectors.groupingBy(s -> s.getDirection().getName(), Collectors.counting()));

        List<HistoriqueEmailResponseDTO> derniersEmails = historiqueEmailRepository
                .findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "dateEnvoi", "heureEnvoi")))
                .getContent().stream()
                .map(this::mapToHistoriqueDTO)
                .collect(Collectors.toList());

        DashboardStatsResponseDTO stats = DashboardStatsResponseDTO.builder()
                .totalSalariesActifs(totalSalariesActifs)
                .totalEvaluationsEnCours(totalEnCours)
                .totalEvaluationsEnRelance(totalEnRelance)
                .totalEvaluationsEnRetardCritique(totalEnRetard)
                .totalEvaluationsCompletees(totalCompletees)
                .repartitionParDirection(repartition)
                .derniersEmailsEnvoyes(derniersEmails)
                .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/audit-emails")
    @Operation(summary = "Piste d'audit des e-mails envoyes")
    public ResponseEntity<List<HistoriqueEmailResponseDTO>> getHistoriqueEmails() {
        List<HistoriqueEmailResponseDTO> historique = historiqueEmailRepository
                .findAll(Sort.by(Sort.Direction.DESC, "dateEnvoi", "heureEnvoi")).stream()
                .map(this::mapToHistoriqueDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historique);
    }

    private HistoriqueEmailResponseDTO mapToHistoriqueDTO(HistoriqueEmail histo) {
        return HistoriqueEmailResponseDTO.builder()
                .id(histo.getId())
                .salarieNom(histo.getSalarieNom())
                .destinataire(histo.getDestinataire())
                .destinataireNom(histo.getDestinataireNom())
                .roleDestinataire(histo.getRoleDestinataire() != null ? histo.getRoleDestinataire().name() : null)
                .objet(histo.getObjet())
                .typeEmail(histo.getTypeEmail() != null ? histo.getTypeEmail().name() : null)
                .dateEnvoi(histo.getDateEnvoi())
                .heureEnvoi(histo.getHeureEnvoi())
                .statut(histo.getStatut())
                .batchCron(histo.isBatchCron())
                .build();
    }
}