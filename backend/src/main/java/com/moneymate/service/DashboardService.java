package com.moneymate.service;

import com.moneymate.dto.*;
import com.moneymate.entity.Budget;
import com.moneymate.entity.User;
import com.moneymate.exception.ResourceNotFoundException;
import com.moneymate.repository.BudgetRepository;
import com.moneymate.repository.GoalRepository;
import com.moneymate.repository.TransactionRepository;
import com.moneymate.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;
    private final GoalService goalService;

    // Distinct modern vibrant color palette for categories
    private static final Map<String, String> CATEGORY_COLORS = Map.of(
            "Food", "#10B981",          // Emerald Green
            "Transport", "#3B82F6",     // Royal Blue
            "Shopping", "#F59E0B",      // Amber Orange
            "Bills", "#EF4444",         // Red
            "Entertainment", "#8B5CF6", // Purple
            "Health", "#EC4899",        // Pink
            "Education", "#06B6D4",     // Cyan
            "Investment", "#14B8A6",    // Teal
            "Salary", "#6366F1",        // Indigo
            "Other", "#64748B"          // Slate Gray
    );

    public DashboardService(TransactionRepository transactionRepository,
                            BudgetRepository budgetRepository,
                            GoalRepository goalRepository,
                            UserRepository userRepository,
                            BudgetService budgetService,
                            GoalService goalService) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.budgetService = budgetService;
        this.goalService = goalService;
    }

    public DashboardSummaryResponse getDashboardSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        DashboardSummaryResponse response = new DashboardSummaryResponse();

        // 1. Overall Financials
        BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndType(user.getId(), "INCOME");
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserIdAndType(user.getId(), "EXPENSE");
        BigDecimal savings = totalIncome.subtract(totalExpenses);

        response.setTotalIncome(totalIncome);
        response.setTotalExpenses(totalExpenses);
        response.setTotalBalance(savings);
        response.setSavings(savings);

        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            double rate = savings.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            response.setSavingsRate(Math.max(0.0, rate));
        } else {
            response.setSavingsRate(0.0);
        }

        // 2. Current Month Budget Overview
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal totalBudget = budgetRepository.sumTotalBudgetAmountByUserId(user.getId());
        BigDecimal currentMonthExpenses = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                user.getId(), "EXPENSE", startOfMonth, endOfMonth);

        response.setTotalBudget(totalBudget);
        response.setBudgetSpent(currentMonthExpenses);

        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            double budgetPct = currentMonthExpenses.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            response.setBudgetPercentage(budgetPct);
        } else {
            response.setBudgetPercentage(0.0);
        }

        // 3. Goal counts
        long activeGoals = goalRepository.countByUserIdAndStatus(user.getId(), "IN_PROGRESS");
        long achievedGoals = goalRepository.countByUserIdAndStatus(user.getId(), "ACHIEVED");
        response.setActiveGoalsCount(activeGoals);
        response.setOnTrackGoalsCount(activeGoals + achievedGoals);

        // 4. Last 6 Months Overview
        List<MonthlyFinanceDto> monthlyOverview = new ArrayList<>();
        YearMonth currentYearMonth = YearMonth.now();

        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentYearMonth.minusMonths(i);
            LocalDate mStart = ym.atDay(1);
            LocalDate mEnd = ym.atEndOfMonth();

            BigDecimal mIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    user.getId(), "INCOME", mStart, mEnd);
            BigDecimal mExpense = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    user.getId(), "EXPENSE", mStart, mEnd);

            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyOverview.add(new MonthlyFinanceDto(monthName, ym.getMonthValue(), ym.getYear(), mIncome, mExpense));
        }
        response.setMonthlyOverview(monthlyOverview);

        // 5. Category Breakdown (from actual expenses)
        List<Object[]> categorySums = transactionRepository.findCategoryExpenseSumsByUserId(user.getId());
        List<CategoryExpenseDto> categoryBreakdown = new ArrayList<>();

        for (Object[] row : categorySums) {
            String cat = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            double pct = 0.0;
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = amount.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }
            String color = CATEGORY_COLORS.getOrDefault(cat, "#64748B");
            categoryBreakdown.add(new CategoryExpenseDto(cat, amount, pct, color));
        }
        response.setCategoryBreakdown(categoryBreakdown);

        // 6. Recent Transactions
        List<TransactionResponse> recent = transactionRepository.findTop5ByUserIdOrderByTransactionDateDescCreatedAtDesc(user.getId())
                .stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
        response.setRecentTransactions(recent);

        // 7. Budgets and Goals lists
        response.setBudgets(budgetService.getAllBudgets(email));
        response.setGoals(goalService.getAllGoals(email));

        return response;
    }
}
