package com.moneymate.controller;

import com.moneymate.dto.ApiResponse;
import com.moneymate.dto.ChangePasswordRequest;
import com.moneymate.dto.UpdateProfileRequest;
import com.moneymate.dto.UserDto;
import com.moneymate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Principal principal) {
        UserDto userDto = userService.getCurrentUserProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDto));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(Principal principal,
                                                              @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(Principal principal,
                                                            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
