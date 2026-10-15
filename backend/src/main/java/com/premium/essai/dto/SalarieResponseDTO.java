package com.premium.essai.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalarieResponseDTO {
    private Long id;
    private String matricule;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String poste;
    private LocalDate dateEmbauche;
    private LocalDate dateFinPrevisionnelle;
    private String directionName;
    private String responsableNomComplet;
    private String statutEssai;
    private boolean actif;
}