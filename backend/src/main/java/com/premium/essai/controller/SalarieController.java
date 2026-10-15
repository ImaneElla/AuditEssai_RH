package com.premium.essai.controller;

import com.premium.essai.dto.SalarieRequestDTO;
import com.premium.essai.dto.SalarieResponseDTO;
import com.premium.essai.service.SalarieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salaries")
@RequiredArgsConstructor
@Tag(name = "1. Salariés", description = "APIs de gestion des collaborateurs et de leur statut d'essai")
public class SalarieController {

    private final SalarieService salarieService;

    @PostMapping
    @Operation(summary = "Créer un nouveau salarié", description = "Génère automatiquement le matricule GP-YYYY-XXX et la Période 1 (3 mois)")
    public ResponseEntity<SalarieResponseDTO> createSalarie(@Valid @RequestBody SalarieRequestDTO dto) {
        return new ResponseEntity<>(salarieService.createSalarie(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Lister tous les salariés actifs")
    public ResponseEntity<List<SalarieResponseDTO>> getAllSalariesActifs() {
        return ResponseEntity.ok(salarieService.getAllSalariesActifs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'un salarié par ID")
    public ResponseEntity<SalarieResponseDTO> getSalarieById(@PathVariable Long id) {
        return ResponseEntity.ok(salarieService.getSalarieById(id));
    }

    @PostMapping("/{id}/demission")
    @Operation(summary = "Clôturer le dossier d'un salarié suite à une démission / rupture", description = "Bloque immédiatement tous les envois d'e-mails futurs")
    public ResponseEntity<Void> cloturerDemission(@PathVariable Long id, @RequestParam(required = false) String motif) {
        salarieService.cloturerDemission(id, motif);
        return ResponseEntity.noContent().build();
    }
}