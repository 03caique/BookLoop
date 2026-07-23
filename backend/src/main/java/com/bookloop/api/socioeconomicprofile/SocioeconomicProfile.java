package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;

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

    public BigDecimal calculateIncomePerCapita(){
        if (familyIncome == null || householdSize == null || householdSize <= 0) {
            throw new IllegalStateException("Não é possível calcular a renda per capita");
        }

        return familyIncome.divide(BigDecimal.valueOf(householdSize), 2, RoundingMode.HALF_UP);
    }

    private int calculateIncomePriority() {
        BigDecimal incomePerCapita = calculateIncomePerCapita();

        if (incomePerCapita.compareTo(new BigDecimal("500")) <= 0) {
            return 70;
        }
        if (incomePerCapita.compareTo(new BigDecimal("1000")) <= 0) {
            return 55;
        }
        if (incomePerCapita.compareTo(new BigDecimal("2000")) <= 0) {
            return 40;
        }
        if (incomePerCapita.compareTo(new BigDecimal("3000")) <= 0) {
            return 20;
        }

        return 0;
    }

    private int calculateEducationPriority() {
        if (educationLevel == null) {
            return 0;
        }

        return switch (educationLevel) {
            case ENSINO_FUNDAMENTAL_INCOMPLETO -> 30;
            case ENSINO_FUNDAMENTAL_COMPLETO -> 28;
            case ENSINO_MEDIO_INCOMPLETO -> 24;
            case ENSINO_MEDIO_COMPLETO -> 20;
            case ENSINO_SUPERIOR_INCOMPLETO -> 15;
            case ENSINO_SUPERIOR_COMPLETO -> 10;
            case POS_GRADUACAO_INCOMPLETO -> 5;
            case POS_GRADUACAO_COMPLETO -> 0;
        };
    }

    public int calculatePriority() {
        return calculateIncomePriority()
                + calculateEducationPriority();
    }
}
