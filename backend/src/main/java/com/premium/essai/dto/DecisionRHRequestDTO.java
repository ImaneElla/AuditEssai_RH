package com.premium.essai.dto;

import com.premium.essai.enums.DecisionFinal;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DecisionRHRequestDTO {

    @NotNull(message = "La décision finale RH est obligatoire")
    private DecisionFinal decisionFinale;

    private String commentaireRH;
}