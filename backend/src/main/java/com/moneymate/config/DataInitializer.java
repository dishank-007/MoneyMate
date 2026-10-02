package com.moneymate.config;

import com.moneymate.entity.*;
import com.moneymate.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TransactionRepository transactionRepository,
                           BudgetRepository budgetRepository,
                           GoalRepository goalRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Initializing MoneyMate seed data...");

            // 1. Create standard demo user
            User dishank = new User();
            dishank.setFullName("Dishank Singh");
            dishank.setEmail("dishank@gmail.com");
            dishank.setPassword(passwordEncoder.encode("password123"));
            dishank.setPhone("+91 9876543210");
            dishank.setCurrency("INR");
            dishank.setRole(Role.USER);
            dishank.setStatus("ACTIVE");
            dishank.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");
            dishank = userRepository.save(dishank);

            // 2. Create demo admin user
            User admin = new User();
            admin.setFullName("MoneyMate Admin");
            admin.setEmail("admin@moneymate.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("+91 9998887776");
            admin.setCurrency("INR");
            admin.setRole(Role.ADMIN);
            admin.setStatus("ACTIVE");
            admin.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80");
            userRepository.save(admin);

            // 3. Seed Transactions for Dishank (spanning current and past months)
            LocalDate today = LocalDate.now();
            int currentYear = today.getYear();
            int currentMonth = today.getMonthValue();

            // Current month transactions (matching the mockup)
            transactionRepository.save(new Transaction(dishank, "INCOME", "Salary", new BigDecimal("25000.00"), LocalDate.of(currentYear, currentMonth, 1), "Monthly Salary", "Bank Transfer"));
            transactionRepository.save(new Transaction(dishank, "INCOME", "Investment", new BigDecimal("2500.00"), LocalDate.of(currentYear, currentMonth, 5), "Stock Dividend", "UPI"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Food", new BigDecimal("500.00"), LocalDate.of(currentYear, currentMonth, Math.min(21, today.getDayOfMonth())), "Dinner with friends", "UPI"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Transport", new BigDecimal("300.00"), LocalDate.of(currentYear, currentMonth, Math.min(19, today.getDayOfMonth())), "Metro recharge", "Debit Card"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Shopping", new BigDecimal("1200.00"), LocalDate.of(currentYear, currentMonth, Math.min(18, today.getDayOfMonth())), "Clothes shopping", "Credit Card"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Bills", new BigDecimal("800.00"), LocalDate.of(currentYear, currentMonth, Math.min(16, today.getDayOfMonth())), "Electricity bill", "Net Banking"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Entertainment", new BigDecimal("350.00"), LocalDate.of(currentYear, currentMonth, Math.min(14, today.getDayOfMonth())), "Movie ticket", "UPI"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Food", new BigDecimal("350.00"), LocalDate.of(currentYear, currentMonth, Math.min(12, today.getDayOfMonth())), "Lunch at cafe", "Cash"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Food", new BigDecimal("1200.00"), LocalDate.of(currentYear, currentMonth, Math.min(10, today.getDayOfMonth())), "Weekly groceries", "Credit Card"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Transport", new BigDecimal("450.00"), LocalDate.of(currentYear, currentMonth, Math.min(8, today.getDayOfMonth())), "Cab fare", "UPI"));
            transactionRepository.save(new Transaction(dishank, "EXPENSE", "Shopping", new BigDecimal("750.00"), LocalDate.of(currentYear, currentMonth, Math.min(6, today.getDayOfMonth())), "Books & stationery", "UPI"));

            // Past months transactions for trend charts
            for (int i = 1; i <= 5; i++) {
                LocalDate pastDate = today.minusMonths(i);
                int pYear = pastDate.getYear();
                int pMonth = pastDate.getMonthValue();
                transactionRepository.save(new Transaction(dishank, "INCOME", "Salary", new BigDecimal("25000.00"), LocalDate.of(pYear, pMonth, 1), "Salary for month", "Bank Transfer"));
                transactionRepository.save(new Transaction(dishank, "EXPENSE", "Food", new BigDecimal("3200.00"), LocalDate.of(pYear, pMonth, 10), "Groceries & Dining", "UPI"));
                transactionRepository.save(new Transaction(dishank, "EXPENSE", "Shopping", new BigDecimal("2400.00"), LocalDate.of(pYear, pMonth, 15), "Shopping", "Credit Card"));
                transactionRepository.save(new Transaction(dishank, "EXPENSE", "Bills", new BigDecimal("1800.00"), LocalDate.of(pYear, pMonth, 20), "Utilities & WiFi", "Net Banking"));
                transactionRepository.save(new Transaction(dishank, "EXPENSE", "Transport", new BigDecimal("1200.00"), LocalDate.of(pYear, pMonth, 25), "Fuel & Transit", "Debit Card"));
            }

            // 4. Seed Budgets
            LocalDate startOfMonth = today.withDayOfMonth(1);
            LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

            budgetRepository.save(new Budget(dishank, "Food", new BigDecimal("5000.00"), "MONTHLY", startOfMonth, endOfMonth));
            budgetRepository.save(new Budget(dishank, "Transport", new BigDecimal("3000.00"), "MONTHLY", startOfMonth, endOfMonth));
            budgetRepository.save(new Budget(dishank, "Shopping", new BigDecimal("4000.00"), "MONTHLY", startOfMonth, endOfMonth));
            budgetRepository.save(new Budget(dishank, "Bills", new BigDecimal("3000.00"), "MONTHLY", startOfMonth, endOfMonth));
            budgetRepository.save(new Budget(dishank, "Entertainment", new BigDecimal("2000.00"), "MONTHLY", startOfMonth, endOfMonth));

            // 5. Seed Goals
            goalRepository.save(new Goal(dishank, "Buy a Laptop", new BigDecimal("80000.00"), new BigDecimal("40000.00"), LocalDate.of(2026, 12, 31), "Save money to buy a new laptop for studies."));
            goalRepository.save(new Goal(dishank, "Europe Trip", new BigDecimal("200000.00"), new BigDecimal("120000.00"), LocalDate.of(2027, 6, 15), "Dream vacation tour across Western Europe."));
            goalRepository.save(new Goal(dishank, "Emergency Fund", new BigDecimal("100000.00"), new BigDecimal("50000.00"), LocalDate.of(2026, 11, 30), "6 months safety reserve buffer."));

            // 6. Seed Notifications
            notificationRepository.save(new Notification(dishank, "Welcome to MoneyMate!", "Welcome to MoneyMate. Master Your Money. Simplify Your Life.", "SUCCESS"));
            notificationRepository.save(new Notification(dishank, "Salary Credited", "Your monthly salary of INR 25,000 has been recorded successfully.", "INFO"));
            notificationRepository.save(new Notification(dishank, "Budget Alert: Food", "You have utilized over 70% of your Food budget for this month.", "WARNING"));

            logger.info("Seed data successfully initialized for user 'dishank@gmail.com' and 'admin@moneymate.com'!");
        }
    }
}
