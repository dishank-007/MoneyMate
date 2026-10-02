package com.moneymate.service;

import com.moneymate.dto.AdminDashboardResponse;
import com.moneymate.dto.UserDto;
import com.moneymate.entity.User;
import com.moneymate.exception.ResourceNotFoundException;
import com.moneymate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final com.moneymate.repository.TransactionRepository transactionRepository;

    public AdminService(UserRepository userRepository, com.moneymate.repository.TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        List<User> allUsers = userRepository.findAll();

        long total = allUsers.size();
        long active = allUsers.stream().filter(u -> "ACTIVE".equalsIgnoreCase(u.getStatus())).count();
        long inactive = total - active;

        response.setTotalUsers(total);
        response.setActiveUsers(active);
        response.setInactiveUsers(inactive);
        response.setNewUsersThisMonth(total); // For demo overview

        List<UserDto> dtos = allUsers.stream().map(UserDto::new).collect(Collectors.toList());
        response.setUsers(dtos);

        // Platform-wide transaction totals
        long txnCount = transactionRepository.count();
        response.setTotalTransactions(txnCount);

        java.math.BigDecimal totalIncome = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalExpenses = java.math.BigDecimal.ZERO;
        for (User u : allUsers) {
            java.math.BigDecimal uIncome = transactionRepository.sumAmountByUserIdAndType(u.getId(), "INCOME");
            java.math.BigDecimal uExpense = transactionRepository.sumAmountByUserIdAndType(u.getId(), "EXPENSE");
            if (uIncome != null) totalIncome = totalIncome.add(uIncome);
            if (uExpense != null) totalExpenses = totalExpenses.add(uExpense);
        }
        response.setTotalIncome(totalIncome);
        response.setTotalExpenses(totalExpenses);

        return response;
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            user.setStatus("INACTIVE");
        } else {
            user.setStatus("ACTIVE");
        }

        User updated = userRepository.save(user);
        return new UserDto(updated);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
