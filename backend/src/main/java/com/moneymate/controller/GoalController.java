package com.moneymate.controller;

import com.moneymate.dto.AddSavingsRequest;
import com.moneymate.dto.ApiResponse;
import com.moneymate.dto.GoalRequest;
import com.moneymate.dto.GoalResponse;
import com.moneymate.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoals(Principal principal) {
        List<GoalResponse> goals = goalService.getAllGoals(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Goals retrieved successfully", goals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GoalResponse>> getGoalById(Principal principal, @PathVariable Long id) {
        GoalResponse goal = goalService.getGoalById(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Goal retrieved successfully", goal));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(Principal principal,
                                                                @Valid @RequestBody GoalRequest request) {
        GoalResponse response = goalService.createGoal(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GoalResponse>> updateGoal(Principal principal,
                                                                @PathVariable Long id,
                                                                @Valid @RequestBody GoalRequest request) {
        GoalResponse response = goalService.updateGoal(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", response));
    }

    @PostMapping("/{id}/savings")
    public ResponseEntity<ApiResponse<GoalResponse>> addSavings(Principal principal,
                                                                @PathVariable Long id,
                                                                @Valid @RequestBody AddSavingsRequest request) {
        GoalResponse response = goalService.addSavings(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Savings added successfully to goal", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(Principal principal, @PathVariable Long id) {
        goalService.deleteGoal(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Goal deleted successfully", null));
    }
}
