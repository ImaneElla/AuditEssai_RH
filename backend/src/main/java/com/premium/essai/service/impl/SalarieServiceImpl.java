package com.premium.essai.service.impl;

import com.premium.essai.dto.SalarieRequestDTO;
import com.premium.essai.dto.SalarieResponseDTO;
import com.premium.essai.entity.Direction;
import com.premium.essai.entity.PeriodeEvaluation;
import com.premium.essai.entity.Responsable;
import com.premium.essai.entity.Salarie;
import com.premium.essai.enums.StatutEssai;
import com.premium.essai.enums.StatutPeriode;
import com.premium.essai.enums.TypePeriode;
import com.premium.essai.repository.DirectionRepository;
import com.premium.essai.repository.PeriodeEvaluationRepository;
import com.premium.essai.repository.ResponsableRepository;
import com.premium.essai.repository.SalarieRepository;
import com.premium.essai.service.SalarieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalarieServiceImpl implements SalarieService {

    private final SalarieRepository salarieRepository;
    private final DirectionRepository directionRepository;
    private final ResponsableRepository responsableRepository;
    private final PeriodeEvaluationRepository periodeRepository;

    @Override
    @Transactional
    public SalarieResponseDTO createSalarie(SalarieRequestDTO dto) {
        Direction direction = directionRepository.findById(dto.getDirectionId())
                .orElseThrow(() -> new RuntimeException("Direction non trouvée ID: " + dto.getDirectionId()));

        Responsable responsable = responsableRepository.findById(dto.getResponsableId())
                .orElseThrow(() -> new RuntimeException("Responsable non trouvé ID: " + dto.getResponsableId()));

        String matricule = generateUniqueMatricule();
        LocalDate dateEmbauche = dto.getDateEmbauche();
        LocalDate dateFinPrevisionnelle = dateEmbauche.plusMonths(6);

        Salarie salarie = Salarie.builder()
                .matricule(matricule)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .poste(dto.getPoste())
                .dateEmbauche(dateEmbauche)
                .dateFinPrevisionnelle(dateFinPrevisionnelle)
                .direction(direction)
                .responsable(responsable)
                .statutEssai(StatutEssai.EN_COURS)
                .bloqueEmails(false)
                .actif(true)
                .build();

        Salarie savedSalarie = salarieRepository.save(salarie);

        PeriodeEvaluation p1 = PeriodeEvaluation.builder()
                .salarie(savedSalarie)
                .responsable(responsable)
                .typePeriode(TypePeriode.TROIS_MOIS)
                .dateEcheance(dateEmbauche.plusMonths(3))
                .statut(StatutPeriode.PLANIFIEE)
                .tokenAccesSalarie(UUID.randomUUID().toString())
                .build();

        periodeRepository.save(p1);

        return mapToResponseDTO(savedSalarie);
    }

    @Override
    @Transactional(readOnly = true)
    public SalarieResponseDTO getSalarieById(Long id) {
        Salarie salarie = salarieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salarié non trouvé ID: " + id));
        return mapToResponseDTO(salarie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalarieResponseDTO> getAllSalariesActifs() {
        return salarieRepository.findByActifTrue().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cloturerDemission(Long salarieId, String motif) {
        Salarie salarie = salarieRepository.findById(salarieId)
                .orElseThrow(() -> new RuntimeException("Salarié non trouvé ID: " + salarieId));

        salarie.setActif(false);
        salarie.setBloqueEmails(true);
        salarie.setStatutEssai(StatutEssai.RUPTURE);
        salarieRepository.save(salarie);
    }

    private String generateUniqueMatricule() {
        long count = salarieRepository.count() + 1;
        int currentYear = LocalDate.now().getYear();
        return String.format("GP-%d-%03d", currentYear, count);
    }

    private SalarieResponseDTO mapToResponseDTO(Salarie salarie) {
        return SalarieResponseDTO.builder()
                .id(salarie.getId())
                .matricule(salarie.getMatricule())
                .firstName(salarie.getFirstName())
                .lastName(salarie.getLastName())
                .email(salarie.getEmail())
                .phone(salarie.getPhone())
                .poste(salarie.getPoste())
                .dateEmbauche(salarie.getDateEmbauche())
                .dateFinPrevisionnelle(salarie.getDateFinPrevisionnelle())
                .directionName(salarie.getDirection().getName())
                .responsableNomComplet(salarie.getResponsable().getFirstName() + " " + salarie.getResponsable().getLastName())
                .statutEssai(salarie.getStatutEssai().name())
                .actif(salarie.isActif())
                .build();
    }
}