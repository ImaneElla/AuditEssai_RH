package com.premium.essai.service;

import com.premium.essai.dto.SalarieRequestDTO;
import com.premium.essai.dto.SalarieResponseDTO;

import java.util.List;

public interface SalarieService {
    SalarieResponseDTO createSalarie(SalarieRequestDTO dto);
    List<SalarieResponseDTO> getAllSalariesActifs();
    SalarieResponseDTO getSalarieById(Long id);
    void cloturerDemission(Long salarieId, String motif);
}
