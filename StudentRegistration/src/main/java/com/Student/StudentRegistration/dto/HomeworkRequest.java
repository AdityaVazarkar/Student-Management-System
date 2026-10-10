package com.Student.StudentRegistration.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HomeworkRequest {
    private String title;
    private String description;
    private String subject;
    private String targetClass;
    private LocalDate dueDate;
    private Integer maxPoints;
    private String teacherName;
}
