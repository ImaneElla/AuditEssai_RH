package com.premium.essai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "template_emails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateEmail {

    @Id
    private String id; // e.g. "email1", "email2", "email3"

    private String nom;

    private Integer delai;

    private String objet;

    @Column(columnDefinition = "TEXT")
    private String contenu;
}