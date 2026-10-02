package com.moneymate.dto;

import com.moneymate.entity.Goal;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class GoalResponse {
    private Long id;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private BigDecimal remainingAmount;
    private double progressPercentage;
    private LocalDate deadline;
    private String description;
    private String status;
    private boolean isAchieved;

    public GoalResponse() {}

    public GoalResponse(Goal goal) {
        if (goal != null) {
            this.id = goal.getId();
            this.title = goal.getTitle();
            this.targetAmount = goal.getTargetAmount();
            this.savedAmount = goal.getSavedAmount() != null ? goal.getSavedAmount() : BigDecimal.ZERO;
            this.deadline = goal.getDeadline();
            this.description = goal.getDescription();
            this.status = goal.getStatus();
            
            this.remainingAmount = this.targetAmount.subtract(this.savedAmount);
            if (this.remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
                this.remainingAmount = BigDecimal.ZERO;
            }
            
            if (this.targetAmount.compareTo(BigDecimal.ZERO) > 0) {
                this.progressPercentage = Math.min(100.0, this.savedAmount
                        .divide(this.targetAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue());
            } else {
                this.progressPercentage = 0.0;
            }
            
            this.isAchieved = "ACHIEVED".equalsIgnoreCase(this.status) || this.savedAmount.compareTo(this.targetAmount) >= 0;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // Alias for frontend compatibility
    public String getName() {
        return title;
    }

    public void setName(String name) {
        this.title = name;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getSavedAmount() {
        return savedAmount;
    }

    public void setSavedAmount(BigDecimal savedAmount) {
        this.savedAmount = savedAmount;
    }

    // Alias for frontend compatibility
    public BigDecimal getCurrentAmount() {
        return savedAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.savedAmount = currentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    // Alias for frontend compatibility
    public LocalDate getTargetDate() {
        return deadline;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.deadline = targetDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAchieved() {
        return isAchieved;
    }

    public void setAchieved(boolean achieved) {
        isAchieved = achieved;
    }
}
