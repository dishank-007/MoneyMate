package com.moneymate.dto;

import java.math.BigDecimal;

public class MonthlyFinanceDto {
    private String month;
    private int monthValue;
    private int year;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;

    public MonthlyFinanceDto() {}

    public MonthlyFinanceDto(String month, int monthValue, int year, BigDecimal income, BigDecimal expense) {
        this.month = month;
        this.monthValue = monthValue;
        this.year = year;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.savings = this.income.subtract(this.expense);
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getMonthValue() {
        return monthValue;
    }

    public void setMonthValue(int monthValue) {
        this.monthValue = monthValue;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getSavings() {
        return savings;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }
}
