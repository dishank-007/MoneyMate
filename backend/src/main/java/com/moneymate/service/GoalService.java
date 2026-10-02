package com.moneymate.service;

import com.moneymate.dto.AddSavingsRequest;
import com.moneymate.dto.GoalRequest;
import com.moneymate.dto.GoalResponse;
import com.moneymate.entity.Goal;
import com.moneymate.entity.Notification;
import com.moneymate.entity.User;
import com.moneymate.exception.ResourceNotFoundException;
import com.moneymate.repository.GoalRepository;
import com.moneymate.repository.NotificationRepository;
import com.moneymate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public GoalService(GoalRepository goalRepository,
                       UserRepository userRepository,
                       NotificationRepository notificationRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<GoalResponse> getAllGoals(String email) {
        User user = getUserByEmail(email);
        return goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(GoalResponse::new)
                .collect(Collectors.toList());
    }

    public GoalResponse getGoalById(String email, Long id) {
        User user = getUserByEmail(email);
        Goal goal = goalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found or access denied"));
        return new GoalResponse(goal);
    }

    @Transactional
    public GoalResponse createGoal(String email, GoalRequest request) {
        User user = getUserByEmail(email);

        Goal goal = new Goal();
        goal.setUser(user);
        goal.setTitle(request.getTitle().trim());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setSavedAmount(request.getSavedAmount() != null ? request.getSavedAmount() : BigDecimal.ZERO);
        goal.setDeadline(request.getDeadline());
        goal.setDescription(request.getDescription());
        goal.setStatus(goal.getSavedAmount().compareTo(goal.getTargetAmount()) >= 0 ? "ACHIEVED" : "IN_PROGRESS");

        Goal saved = goalRepository.save(goal);
        return new GoalResponse(saved);
    }

    @Transactional
    public GoalResponse updateGoal(String email, Long id, GoalRequest request) {
        User user = getUserByEmail(email);
        Goal goal = goalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found or access denied"));

        goal.setTitle(request.getTitle().trim());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getSavedAmount() != null) {
            goal.setSavedAmount(request.getSavedAmount());
        }
        goal.setDeadline(request.getDeadline());
        goal.setDescription(request.getDescription());
        if (goal.getSavedAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("ACHIEVED");
        } else {
            goal.setStatus("IN_PROGRESS");
        }

        Goal updated = goalRepository.save(goal);
        return new GoalResponse(updated);
    }

    @Transactional
    public GoalResponse addSavings(String email, Long id, AddSavingsRequest request) {
        User user = getUserByEmail(email);
        Goal goal = goalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found or access denied"));

        BigDecimal newSaved = goal.getSavedAmount().add(request.getAmount());
        goal.setSavedAmount(newSaved);

        boolean wasAchieved = "ACHIEVED".equalsIgnoreCase(goal.getStatus());
        if (newSaved.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("ACHIEVED");
            if (!wasAchieved) {
                // Send celebration notification
                Notification notif = new Notification(
                        user,
                        "🎉 Goal Achieved: " + goal.getTitle() + "!",
                        "Congratulations! You've reached your target savings of " + user.getCurrency() + " " + goal.getTargetAmount() + " for '" + goal.getTitle() + "'. Outstanding job!",
                        "SUCCESS"
                );
                notificationRepository.save(notif);
            }
        }

        Goal saved = goalRepository.save(goal);
        return new GoalResponse(saved);
    }

    @Transactional
    public void deleteGoal(String email, Long id) {
        User user = getUserByEmail(email);
        Goal goal = goalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found or access denied"));

        goalRepository.delete(goal);
    }
}
