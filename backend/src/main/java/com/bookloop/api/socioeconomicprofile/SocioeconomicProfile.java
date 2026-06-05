package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class SocioeconomicProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private BigDecimal familyIncome;

    @Enumerated(EnumType.STRING)
    @NotNull
    private EducationLevel educationLevel;

    @NotNull
    private Integer householdSize;

    @Enumerated(EnumType.STRING)
    @NotNull
    private WorkSituation workSituation;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    @NotNull
    private User user;

}
