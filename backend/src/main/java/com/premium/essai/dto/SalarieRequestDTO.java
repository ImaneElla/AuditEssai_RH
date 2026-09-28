package com.premium.essai.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SalarieRequestDTO {
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String poste;
    private LocalDate dateEmbauche;
    private Long directionId;
    private Long responsableId;
}