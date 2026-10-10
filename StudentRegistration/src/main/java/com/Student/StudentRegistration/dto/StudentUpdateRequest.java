package com.Student.StudentRegistration.dto;

import lombok.Data;

@Data
public class StudentUpdateRequest {
    private String name;
    private String email;
    private String rollNumber;
    private String phone;
    private String className;
}
