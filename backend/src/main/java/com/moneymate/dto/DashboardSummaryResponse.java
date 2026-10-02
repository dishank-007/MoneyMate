package com.moneymate.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryResponse {
    private BigDecimal totalBalance = BigDecimal.ZERO;
    private BigDecimal totalIncome = BigDecimal.ZERO;
    private BigDecimal totalExpenses = BigDecimal.ZERO;
    private BigDecimal savings = BigDecimal.ZERO;
    private double savingsRate = 0.0;
    
    // Budget KPI
    private BigDecimal totalBudget = BigDecimal.ZERO;
    private BigDecimal budgetSpent = BigDecimal.ZERO;
    private double budgetPercentage = 0.0;
    
    // Goal KPI
    private long activeGoalsCount = 0;
    private long onTrackGoalsCount = 0;
    
    // Growth / Trend percentage vs last month
    private double expenseTrendPercentage = 0.0;
    private double incomeTrendPercentage = 0.0;

    // Charts & Lists
    private List<MonthlyFinanceDto> monthlyOverview = new ArrayList<>();
    private List<CategoryExpenseDto> categoryBreakdown = new ArrayList<>();
    private List<TransactionResponse> recentTransactions = new ArrayList<>();
    private List<BudgetResponse> budgets = new ArrayList<>();
    private List<GoalResponse> goals = new ArrayList<>();

    public DashboardSummaryResponse() {}

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
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

    public BigDecimal getSavings() {
        return savings;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }

    public double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getBudgetSpent() {
        return budgetSpent;
    }

    public void setBudgetSpent(BigDecimal budgetSpent) {
        this.budgetSpent = budgetSpent;
    }

    public double getBudgetPercentage() {
        return budgetPercentage;
    }

    public void setBudgetPercentage(double budgetPercentage) {
        this.budgetPercentage = budgetPercentage;
    }

    public long getActiveGoalsCount() {
        return activeGoalsCount;
    }

    public void setActiveGoalsCount(long activeGoalsCount) {
        this.activeGoalsCount = activeGoalsCount;
    }

    public long getOnTrackGoalsCount() {
        return onTrackGoalsCount;
    }

    public void setOnTrackGoalsCount(long onTrackGoalsCount) {
        this.onTrackGoalsCount = onTrackGoalsCount;
    }

    public double getExpenseTrendPercentage() {
        return expenseTrendPercentage;
    }

    public void setExpenseTrendPercentage(double expenseTrendPercentage) {
        this.expenseTrendPercentage = expenseTrendPercentage;
    }

    public double getIncomeTrendPercentage() {
        return incomeTrendPercentage;
    }

    public void setIncomeTrendPercentage(double incomeTrendPercentage) {
        this.incomeTrendPercentage = incomeTrendPercentage;
    }

    public List<MonthlyFinanceDto> getMonthlyOverview() {
        return monthlyOverview;
    }

    public void setMonthlyOverview(List<MonthlyFinanceDto> monthlyOverview) {
        this.monthlyOverview = monthlyOverview;
    }

    // Aliases for frontend compatibility
    public List<MonthlyFinanceDto> getMonthlyTrends() {
        return monthlyOverview;
    }

    public void setMonthlyTrends(List<MonthlyFinanceDto> monthlyTrends) {
        this.monthlyOverview = monthlyTrends;
    }

    public List<CategoryExpenseDto> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryExpenseDto> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    // Aliases for frontend compatibility
    public List<CategoryExpenseDto> getCategoryExpenses() {
        return categoryBreakdown;
    }

    public void setCategoryExpenses(List<CategoryExpenseDto> categoryExpenses) {
        this.categoryBreakdown = categoryExpenses;
    }

    public long getActiveGoals() {
        return activeGoalsCount;
    }

    public void setActiveGoals(long activeGoals) {
        this.activeGoalsCount = activeGoals;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<BudgetResponse> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<BudgetResponse> budgets) {
        this.budgets = budgets;
    }

    public List<GoalResponse> getGoals() {
        return goals;
    }

    public void setGoals(List<GoalResponse> goals) {
        this.goals = goals;
    }
}
