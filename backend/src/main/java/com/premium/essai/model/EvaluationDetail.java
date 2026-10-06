package com.premium.essai.model;

import com.premium.essai.model.enums.RecommandationDecision;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "evaluation_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periode_id", nullable = false, unique = true)
    private PeriodeEvaluation periodeEvaluation;

    @Column(name = "competences_techniques", columnDefinition = "TEXT")
    private String competencesTechniques;

    @Column(name = "integration_equipe", columnDefinition = "TEXT")
    private String integrationEquipe;

    @Column(name = "autonomie_rigueur", columnDefinition = "TEXT")
    private String autonomieRigueur;

    @Column(name = "atteinte_objectifs", columnDefinition = "TEXT")
    private String atteinteObjectifs;

    @Column(name = "points_forts", columnDefinition = "TEXT")
    private String pointsForts;

    @Column(name = "axes_amelioration", columnDefinition = "TEXT")
    private String axesAmelioration;

    @Column(name = "avis_responsable", columnDefinition = "TEXT")
    private String avisResponsable;

    @Column(name = "avis_salarie", columnDefinition = "TEXT")
    private String avisSalarie;

    @Enumerated(EnumType.STRING)
    private RecommandationDecision recommandation;

    @Column(name = "date_evaluation")
    private LocalDate dateEvaluation;

    @Column(name = "signature_responsable")
    private Boolean signatureResponsable;

    @Column(name = "signature_salarie")
    private Boolean signatureSalarie;

    @Column(name = "donnees_formulaire_complet", columnDefinition = "TEXT")
    private String donneesFormulaireComplet;
}