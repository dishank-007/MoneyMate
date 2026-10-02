package com.moneymate.dto;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardResponse {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long newUsersThisMonth;
    private long totalTransactions;
    private java.math.BigDecimal totalIncome = java.math.BigDecimal.ZERO;
    private java.math.BigDecimal totalExpenses = java.math.BigDecimal.ZERO;
    private List<UserDto> users = new ArrayList<>();

    public AdminDashboardResponse() {}

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public java.math.BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(java.math.BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public java.math.BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(java.math.BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getInactiveUsers() {
        return inactiveUsers;
    }

    public void setInactiveUsers(long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }

    public long getNewUsersThisMonth() {
        return newUsersThisMonth;
    }

    public void setNewUsersThisMonth(long newUsersThisMonth) {
        this.newUsersThisMonth = newUsersThisMonth;
    }

    public List<UserDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserDto> users) {
        this.users = users;
    }
}
