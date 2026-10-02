package com.moneymate.dto;

import com.moneymate.entity.Transaction;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String type;
    private String category;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private String description;
    private String paymentMethod;
    private LocalDateTime createdAt;

    public TransactionResponse() {}

    public TransactionResponse(Transaction transaction) {
        if (transaction != null) {
            this.id = transaction.getId();
            this.type = transaction.getType();
            this.category = transaction.getCategory();
            this.amount = transaction.getAmount();
            this.transactionDate = transaction.getTransactionDate();
            this.description = transaction.getDescription();
            this.paymentMethod = transaction.getPaymentMethod();
            this.createdAt = transaction.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    // Alias for frontend compatibility
    public LocalDate getDate() {
        return transactionDate;
    }

    public void setDate(LocalDate date) {
        this.transactionDate = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
