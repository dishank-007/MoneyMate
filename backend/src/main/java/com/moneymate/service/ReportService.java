package com.moneymate.service;

import com.moneymate.dto.CategoryExpenseDto;
import com.moneymate.dto.MonthlyFinanceDto;
import com.moneymate.dto.ReportResponse;
import com.moneymate.dto.TransactionResponse;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    private static final Map<String, String> CATEGORY_COLORS = Map.of(
            "Food", "#10B981",
            "Transport", "#3B82F6",
            "Shopping", "#F59E0B",
            "Bills", "#EF4444",
            "Entertainment", "#8B5CF6",
            "Health", "#EC4899",
            "Education", "#06B6D4",
            "Investment", "#14B8A6",
            "Salary", "#6366F1",
            "Other", "#64748B"
    );

    public ReportService(TransactionRepository transactionRepository,
                         BudgetRepository budgetRepository,
                         GoalRepository goalRepository,
                         UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public ReportResponse generateReport(String email, Integer year, Integer month) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        YearMonth targetYM = (year != null && month != null)
                ? YearMonth.of(year, month)
                : YearMonth.now();

        LocalDate startDate = targetYM.atDay(1);
        LocalDate endDate = targetYM.atEndOfMonth();

        ReportResponse report = new ReportResponse();
        report.setPeriod(targetYM.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + targetYM.getYear());

        // 1. Period totals
        BigDecimal periodIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                user.getId(), "INCOME", startDate, endDate);
        BigDecimal periodExpense = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                user.getId(), "EXPENSE", startDate, endDate);
        BigDecimal netSavings = periodIncome.subtract(periodExpense);

        report.setTotalIncome(periodIncome);
        report.setTotalExpenses(periodExpense);
        report.setNetSavings(netSavings);

        if (periodIncome.compareTo(BigDecimal.ZERO) > 0) {
            double rate = netSavings.divide(periodIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            report.setSavingsRate(Math.max(0.0, rate));
        } else {
            report.setSavingsRate(0.0);
        }

        // 2. Budget utilization
        BigDecimal totalBudget = budgetRepository.sumTotalBudgetAmountByUserId(user.getId());
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            double util = periodExpense.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            report.setBudgetUtilization(util);
        } else {
            report.setBudgetUtilization(0.0);
        }

        // 3. Goals Progress
        BigDecimal totalTarget = goalRepository.sumTargetAmountByUserId(user.getId());
        BigDecimal totalSaved = goalRepository.sumSavedAmountByUserId(user.getId());
        if (totalTarget.compareTo(BigDecimal.ZERO) > 0) {
            double gProgress = totalSaved.divide(totalTarget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            report.setGoalsProgress(Math.min(100.0, gProgress));
        } else {
            report.setGoalsProgress(0.0);
        }

        // 4. Monthly trends (6 months up to targetYM)
        List<MonthlyFinanceDto> monthlyTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = targetYM.minusMonths(i);
            LocalDate mStart = ym.atDay(1);
            LocalDate mEnd = ym.atEndOfMonth();

            BigDecimal mIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    user.getId(), "INCOME", mStart, mEnd);
            BigDecimal mExpense = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    user.getId(), "EXPENSE", mStart, mEnd);

            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyTrends.add(new MonthlyFinanceDto(monthName, ym.getMonthValue(), ym.getYear(), mIncome, mExpense));
        }
        report.setMonthlyTrends(monthlyTrends);

        // 5. Category breakdown for this period
        List<Object[]> categorySums = transactionRepository.findCategoryExpenseSumsByUserIdAndDateBetween(
                user.getId(), startDate, endDate);
        List<CategoryExpenseDto> categoryBreakdown = new ArrayList<>();

        for (Object[] row : categorySums) {
            String cat = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            double pct = 0.0;
            if (periodExpense.compareTo(BigDecimal.ZERO) > 0) {
                pct = amount.divide(periodExpense, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }
            String color = CATEGORY_COLORS.getOrDefault(cat, "#64748B");
            categoryBreakdown.add(new CategoryExpenseDto(cat, amount, pct, color));
        }
        report.setCategoryBreakdown(categoryBreakdown);

        // 6. Top expenses for this period
        List<TransactionResponse> topExpenses = transactionRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                user.getId(), startDate, endDate)
                .stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
                .limit(10)
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
        report.setTopExpenses(topExpenses);

        return report;
    }
}
