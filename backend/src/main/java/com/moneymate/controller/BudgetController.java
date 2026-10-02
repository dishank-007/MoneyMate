package com.moneymate.controller;

import com.moneymate.dto.ApiResponse;
import com.moneymate.dto.BudgetRequest;
import com.moneymate.dto.BudgetResponse;
import com.moneymate.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(Principal principal) {
        List<BudgetResponse> budgets = budgetService.getAllBudgets(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", budgets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(Principal principal, @PathVariable Long id) {
        BudgetResponse budget = budgetService.getBudgetById(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Budget retrieved successfully", budget));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(Principal principal,
                                                                    @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Budget created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(Principal principal,
                                                                    @PathVariable Long id,
                                                                    @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(Principal principal, @PathVariable Long id) {
        budgetService.deleteBudget(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}
