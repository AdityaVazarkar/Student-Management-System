package com.Student.StudentRegistration.dto;

import com.Student.StudentRegistration.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String rollNumber;
    private String className;
    private String message;
}
