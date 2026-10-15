package com.premium.essai.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponseDTO {
    private long totalSalariesActifs;
    private long totalEvaluationsEnCours;
    private long totalEvaluationsEnRelance;
    private long totalEvaluationsEnRetardCritique;
    private long totalEvaluationsCompletees;
    private Map<String, Long> repartitionParDirection;
    private List<HistoriqueEmailResponseDTO> derniersEmailsEnvoyes;
}
