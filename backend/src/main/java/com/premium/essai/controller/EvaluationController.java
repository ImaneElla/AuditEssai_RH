package com.premium.essai.controller;

import com.premium.essai.dto.DecisionRHRequestDTO;
import com.premium.essai.dto.EvaluationDetailRequestDTO;
import com.premium.essai.dto.EvaluationDetailResponseDTO;
import com.premium.essai.service.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/evaluations")
@RequiredArgsConstructor
@Tag(name = "2. Évaluations", description = "APIs pour les formulaires managers et la prise de décision RH")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/access/{token}")
    @Operation(summary = "Accès au formulaire manager par Token sécurisé", description = "Renvoie une erreur si l'échéance est dépassée (Règle strict J+1)")
    public ResponseEntity<EvaluationDetailResponseDTO> getEvaluationByToken(@PathVariable String token) {
        return ResponseEntity.ok(evaluationService.getEvaluationByToken(token));
    }

    @PostMapping("/{periodeId}/soumettre")
    @Operation(summary = "Soumission de la grille par le Manager (24 critères)", description = "Calcule la moyenne /5, applique la cascade P1 -> P2 ou le blocage rupture, et alerte les Admins RH")
    public ResponseEntity<EvaluationDetailResponseDTO> soumettreEvaluation(
            @PathVariable Long periodeId,
            @Valid @RequestBody EvaluationDetailRequestDTO dto) {
        return ResponseEntity.ok(evaluationService.soumettreEvaluation(periodeId, dto));
    }

    @GetMapping("/periode/{periodeId}")
    @Operation(summary = "Consulter le détail d'une évaluation par ID de période")
    public ResponseEntity<EvaluationDetailResponseDTO> getEvaluationByPeriodeId(@PathVariable Long periodeId) {
        return ResponseEntity.ok(evaluationService.getEvaluationByPeriodeId(periodeId));
    }

    @PostMapping("/{periodeId}/decision-directe-rh")
    @Operation(summary = "Prise de décision directe RH en cas de retard manager (J+1 dépassé)")
    public ResponseEntity<Void> priseDeDecisionDirecteRH(
            @PathVariable Long periodeId,
            @Valid @RequestBody DecisionRHRequestDTO dto) {
        evaluationService.priseDeDecisionDirecteRH(periodeId, dto);
        return ResponseEntity.ok().build();
    }
}