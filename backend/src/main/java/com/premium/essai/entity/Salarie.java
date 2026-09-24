package com.premium.essai.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "salaries")
public class Salarie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String matricule;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String poste; // Intitulé du poste

    @Column(name = "date_integration")
    private LocalDate dateIntegration; // Date d'intégration

    // Many salaries belong to one direction - owner side
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direction_id", nullable = true)
    private Direction direction;

    // Many salaries have one responsable - owner side
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id", nullable = false)
    private Responsable responsable;

    public Salarie() {}

    public Salarie(String matricule, String nom, String prenom, String email, String poste, LocalDate dateIntegration, Responsable responsable) {
        this.matricule = matricule;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.poste = poste;
        this.dateIntegration = dateIntegration;
        this.responsable = responsable;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    // Compatibilité firstName / lastName
    public String getFirstName() { return prenom; }
    public void setFirstName(String firstName) { this.prenom = firstName; }

    public String getLastName() { return nom; }
    public void setLastName(String lastName) { this.nom = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public LocalDate getDateIntegration() { return dateIntegration; }
    public void setDateIntegration(LocalDate dateIntegration) { this.dateIntegration = dateIntegration; }

    // Compatibilité dateEmbauche
    public LocalDate getDateEmbauche() { return dateIntegration; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateIntegration = dateEmbauche; }

    public Direction getDirection() { return direction; }
    public void setDirection(Direction direction) { this.direction = direction; }

    public Responsable getResponsable() { return responsable; }
    public void setResponsable(Responsable responsable) { this.responsable = responsable; }
}