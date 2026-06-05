package com.bookloop.api.socioeconomicprofile.dto;

import com.bookloop.api.socioeconomicprofile.EducationLevel;
import com.bookloop.api.socioeconomicprofile.WorkSituation;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class SocioeconomicProfileResponseDTO {

    private Long id;
    private BigDecimal familyIncome;
    private EducationLevel educationLevel;
    private Integer householdSize;
    private WorkSituation workSituation;

}
