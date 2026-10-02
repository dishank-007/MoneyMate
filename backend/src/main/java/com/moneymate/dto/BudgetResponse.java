package com.moneymate.dto;

import com.moneymate.entity.Budget;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal amount; // budget limit
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double percentageUsed;
    private boolean isOverBudget;

    public BudgetResponse() {}

    public BudgetResponse(Budget budget, BigDecimal spentAmount) {
        if (budget != null) {
            this.id = budget.getId();
            this.category = budget.getCategory();
            this.amount = budget.getAmount();
            this.duration = budget.getDuration();
            this.startDate = budget.getStartDate();
            this.endDate = budget.getEndDate();
            
            this.spentAmount = spentAmount != null ? spentAmount : BigDecimal.ZERO;
            this.remainingAmount = this.amount.subtract(this.spentAmount);
            
            if (this.amount.compareTo(BigDecimal.ZERO) > 0) {
                this.percentageUsed = this.spentAmount
                        .divide(this.amount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            } else {
                this.percentageUsed = 0.0;
            }
            
            this.isOverBudget = this.spentAmount.compareTo(this.amount) > 0;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    // Alias for frontend compatibility
    public BigDecimal getSpent() {
        return spentAmount;
    }

    public void setSpent(BigDecimal spent) {
        this.spentAmount = spent;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getPercentageUsed() {
        return percentageUsed;
    }

    public void setPercentageUsed(double percentageUsed) {
        this.percentageUsed = percentageUsed;
    }

    public boolean isOverBudget() {
        return isOverBudget;
    }

    public void setOverBudget(boolean overBudget) {
        isOverBudget = overBudget;
    }
}
