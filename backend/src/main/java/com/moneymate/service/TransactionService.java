package com.moneymate.service;

import com.moneymate.dto.TransactionRequest;
import com.moneymate.dto.TransactionResponse;
import com.moneymate.entity.Budget;
import com.moneymate.entity.Notification;
import com.moneymate.entity.Transaction;
import com.moneymate.entity.User;
import com.moneymate.exception.ResourceNotFoundException;
import com.moneymate.repository.BudgetRepository;
import com.moneymate.repository.NotificationRepository;
import com.moneymate.repository.TransactionRepository;
import com.moneymate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final NotificationRepository notificationRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository,
                              BudgetRepository budgetRepository,
                              NotificationRepository notificationRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.notificationRepository = notificationRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<TransactionResponse> getAllTransactions(String email) {
        User user = getUserByEmail(email);
        return transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(user.getId())
                .stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> searchTransactions(String email, String category, String type, String search) {
        User user = getUserByEmail(email);
        return transactionRepository.searchTransactions(user.getId(), category, type, search)
                .stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(String email, Long id) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or access denied"));
        return new TransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(String email, TransactionRequest request) {
        User user = getUserByEmail(email);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(request.getType().toUpperCase());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");

        Transaction saved = transactionRepository.save(transaction);

        // Check if an expense exceeds or is near any active budget for this category
        if ("EXPENSE".equalsIgnoreCase(saved.getType())) {
            checkBudgetAlerts(user, saved.getCategory());
        }

        return new TransactionResponse(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(String email, Long id, TransactionRequest request) {
        User user = getUserByEmail(email);

        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or access denied"));

        transaction.setType(request.getType().toUpperCase());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");

        Transaction updated = transactionRepository.save(transaction);

        if ("EXPENSE".equalsIgnoreCase(updated.getType())) {
            checkBudgetAlerts(user, updated.getCategory());
        }

        return new TransactionResponse(updated);
    }

    @Transactional
    public void deleteTransaction(String email, Long id) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found or access denied"));

        transactionRepository.delete(transaction);
    }

    private void checkBudgetAlerts(User user, String category) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategory(user.getId(), category);
        if (budgetOpt.isPresent()) {
            Budget b = budgetOpt.get();
            BigDecimal totalSpent = transactionRepository.sumExpenseByCategoryAndDateBetween(
                    user.getId(), b.getCategory(), b.getStartDate(), b.getEndDate());

            if (totalSpent.compareTo(b.getAmount()) > 0) {
                Notification notif = new Notification(
                        user,
                        "Budget Exceeded Alert: " + b.getCategory(),
                        "You have exceeded your " + b.getCategory() + " budget limit of " + user.getCurrency() + " " + b.getAmount() + ". Total spent: " + user.getCurrency() + " " + totalSpent + ".",
                        "ALERT"
                );
                notificationRepository.save(notif);
            } else {
                BigDecimal eightyPercent = b.getAmount().multiply(new BigDecimal("0.80"));
                if (totalSpent.compareTo(eightyPercent) >= 0) {
                    Notification notif = new Notification(
                            user,
                            "Budget Warning: " + b.getCategory(),
                            "You have used over 80% of your " + b.getCategory() + " budget. Total spent: " + user.getCurrency() + " " + totalSpent + " of " + user.getCurrency() + " " + b.getAmount() + ".",
                            "WARNING"
                    );
                    notificationRepository.save(notif);
                }
            }
        }
    }
}
