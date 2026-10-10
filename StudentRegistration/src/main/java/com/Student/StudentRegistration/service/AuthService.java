package com.Student.StudentRegistration.service;

import com.Student.StudentRegistration.dto.AuthResponse;
import com.Student.StudentRegistration.dto.LoginRequest;
import com.Student.StudentRegistration.dto.RegisterRequest;
import com.Student.StudentRegistration.entity.Role;
import com.Student.StudentRegistration.entity.User;
import com.Student.StudentRegistration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword().trim())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .rollNumber(user.getRollNumber())
                .className(user.getClassName())
                .message("Login successful")
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getName() == null) {
            throw new IllegalArgumentException("Name, email, and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        String rollNo = request.getRollNumber();
        if (rollNo == null || rollNo.trim().isEmpty()) {
            rollNo = "STU-" + System.currentTimeMillis() % 100000;
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(request.getPassword().trim())
                .role(Role.STUDENT)
                .rollNumber(rollNo.trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .className(request.getClassName() != null && !request.getClassName().trim().isEmpty() ? request.getClassName().trim() : "Unassigned")
                .build();

        User saved = userRepository.save(user);

        return AuthResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .rollNumber(saved.getRollNumber())
                .className(saved.getClassName())
                .message("Registration successful")
                .build();
    }
}
