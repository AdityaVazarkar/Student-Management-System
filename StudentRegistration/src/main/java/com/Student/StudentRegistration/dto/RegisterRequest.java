package com.Student.StudentRegistration.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String rollNumber;
    private String phone;
    private String className;
}
