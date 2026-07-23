package com.bookloop.api.socioeconomicprofile.dto;

import com.bookloop.api.socioeconomicprofile.EducationLevel;
import com.bookloop.api.socioeconomicprofile.WorkSituation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class SocioeconomicProfileUpdateDTO {

    @PositiveOrZero
    @NotNull
    private BigDecimal familyIncome;

    @NotNull
    private EducationLevel educationLevel;

    @Positive
    @NotNull
    private Integer householdSize;

    @NotNull
    private WorkSituation workSituation;
}