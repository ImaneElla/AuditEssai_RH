package com.premium.essai.repository;
import com.premium.essai.entity.PeriodeEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;






public interface PeriodeEvaluationRepository  extends JpaRepository<PeriodeEvaluation, Long> {
    Optional<PeriodeEvaluation> findByDateDebutAndDateFin(LocalDate dateDebut, LocalDate dateFin);
}
