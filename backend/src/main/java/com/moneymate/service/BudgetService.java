package com.moneymate.service;

import com.moneymate.dto.BudgetRequest;
import com.moneymate.dto.BudgetResponse;
import com.moneymate.entity.Budget;
import com.moneymate.entity.User;
import com.moneymate.exception.ResourceNotFoundException;
import com.moneymate.repository.BudgetRepository;
import com.moneymate.repository.TransactionRepository;
import com.moneymate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         TransactionRepository transactionRepository,
                         UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<BudgetResponse> getAllBudgets(String email) {
        User user = getUserByEmail(email);
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return budgets.stream().map(budget -> {
            BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateBetween(
                    user.getId(), budget.getCategory(), budget.getStartDate(), budget.getEndDate());
            return new BudgetResponse(budget, spent);
        }).collect(Collectors.toList());
    }

    public BudgetResponse getBudgetById(String email, Long id) {
        User user = getUserByEmail(email);
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found or access denied"));

        BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateBetween(
                user.getId(), budget.getCategory(), budget.getStartDate(), budget.getEndDate());
        return new BudgetResponse(budget, spent);
    }

    @Transactional
    public BudgetResponse createBudget(String email, BudgetRequest request) {
        User user = getUserByEmail(email);

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setDuration(request.getDuration() != null ? request.getDuration() : "MONTHLY");
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        Budget saved = budgetRepository.save(budget);
        BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateBetween(
                user.getId(), saved.getCategory(), saved.getStartDate(), saved.getEndDate());
        return new BudgetResponse(saved, spent);
    }

    @Transactional
    public BudgetResponse updateBudget(String email, Long id, BudgetRequest request) {
        User user = getUserByEmail(email);
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found or access denied"));

        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setDuration(request.getDuration() != null ? request.getDuration() : "MONTHLY");
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        Budget updated = budgetRepository.save(budget);
        BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateBetween(
                user.getId(), updated.getCategory(), updated.getStartDate(), updated.getEndDate());
        return new BudgetResponse(updated, spent);
    }

    @Transactional
    public void deleteBudget(String email, Long id) {
        User user = getUserByEmail(email);
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found or access denied"));

        budgetRepository.delete(budget);
    }
}
