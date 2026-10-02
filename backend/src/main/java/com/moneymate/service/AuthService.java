package com.moneymate.service;

import com.moneymate.dto.*;
import com.moneymate.entity.Notification;
import com.moneymate.entity.Role;
import com.moneymate.entity.User;
import com.moneymate.exception.BadRequestException;
import com.moneymate.repository.NotificationRepository;
import com.moneymate.repository.UserRepository;
import com.moneymate.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       NotificationRepository notificationRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match.");
        }

        User user = new User();
        String name = request.getFullName() != null && !request.getFullName().trim().isEmpty() 
                ? request.getFullName().trim() 
                : (request.getName() != null ? request.getName().trim() : "");
        user.setFullName(name);
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Security requirement: Normal signup must always create USER role, never ADMIN
        user.setRole(Role.USER);
        user.setStatus("ACTIVE");
        user.setCurrency(request.getCurrency() != null && !request.getCurrency().trim().isEmpty() 
                ? request.getCurrency().trim().toUpperCase() 
                : "INR");
        user.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");

        User savedUser = userRepository.save(user);

        // Send welcome notification
        Notification welcomeNotif = new Notification(
                savedUser,
                "Welcome to MoneyMate!",
                "Hello " + savedUser.getFullName() + "! Welcome to MoneyMate. Start tracking your income, expenses, budgets, and savings goals today.",
                "SUCCESS"
        );
        notificationRepository.save(welcomeNotif);

        // Authenticate & generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, new UserDto(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User account not found."));

        return new AuthResponse(jwt, new UserDto(user));
    }
}
