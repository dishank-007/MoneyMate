package com.moneymate.controller;

import com.moneymate.dto.ApiResponse;
import com.moneymate.dto.TransactionRequest;
import com.moneymate.dto.TransactionResponse;
import com.moneymate.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactions(
            Principal principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {

        List<TransactionResponse> list;
        if ((category != null && !category.isEmpty()) ||
            (type != null && !type.isEmpty()) ||
            (search != null && !search.isEmpty())) {
            list = transactionService.searchTransactions(principal.getName(), category, type, search);
        } else {
            list = transactionService.getAllTransactions(principal.getName());
        }

        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(Principal principal, @PathVariable Long id) {
        TransactionResponse response = transactionService.getTransactionById(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            Principal principal,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction added successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(Principal principal, @PathVariable Long id) {
        transactionService.deleteTransaction(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
