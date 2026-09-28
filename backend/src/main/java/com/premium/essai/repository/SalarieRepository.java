package com.premium.essai.repository;

import com.premium.essai.entity.Salarie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface SalarieRepository extends JpaRepository<Salarie, Long> {

Optional<Salarie> findByMatricule(String matricule);
Optional<Salarie> findByEmail(String email);
Optional<Salarie> findByNomAndPrenom(String nom, String prenom);
Optional<Salarie> findByNomAndPrenomAndDateEmbauche(
    String nom, 
    String prenom, 
    LocalDate dateEmbauche);

}
