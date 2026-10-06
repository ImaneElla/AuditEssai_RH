package com.premium.essai.model;

import com.premium.essai.model.enums.NotificationPriority;
import com.premium.essai.model.enums.NotificationType;
import com.premium.essai.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    private NotificationPriority priorite;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "heure_creation")
    private LocalTime heureCreation;

    @Column(name = "est_lue")
    @Builder.Default
    private Boolean estLue = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "cible_role")
    private UserRole cibleRole;

    @Column(name = "lien_ecran")
    private String lienEcran;

    @Column(name = "target_id")
    private Long targetId;
}