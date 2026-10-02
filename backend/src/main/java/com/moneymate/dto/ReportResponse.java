package com.moneymate.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ReportResponse {
    private String period;
    private BigDecimal totalIncome = BigDecimal.ZERO;
    private BigDecimal totalExpenses = BigDecimal.ZERO;
    private BigDecimal netSavings = BigDecimal.ZERO;
    private double savingsRate = 0.0;
    private double budgetUtilization = 0.0;
    private double goalsProgress = 0.0;

    private List<MonthlyFinanceDto> monthlyTrends = new ArrayList<>();
    private List<CategoryExpenseDto> categoryBreakdown = new ArrayList<>();
    private List<TransactionResponse> topExpenses = new ArrayList<>();

    public ReportResponse() {}

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }

    public double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public double getBudgetUtilization() {
        return budgetUtilization;
    }

    public void setBudgetUtilization(double budgetUtilization) {
        this.budgetUtilization = budgetUtilization;
    }

    public double getGoalsProgress() {
        return goalsProgress;
    }

    public void setGoalsProgress(double goalsProgress) {
        this.goalsProgress = goalsProgress;
    }

    public List<MonthlyFinanceDto> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyFinanceDto> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<CategoryExpenseDto> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryExpenseDto> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    // Alias for frontend compatibility
    public List<CategoryExpenseDto> getCategoryExpenses() {
        return categoryBreakdown;
    }

    public void setCategoryExpenses(List<CategoryExpenseDto> categoryExpenses) {
        this.categoryBreakdown = categoryExpenses;
    }

    public List<TransactionResponse> getTopExpenses() {
        return topExpenses;
    }

    public void setTopExpenses(List<TransactionResponse> topExpenses) {
        this.topExpenses = topExpenses;
    }
}
