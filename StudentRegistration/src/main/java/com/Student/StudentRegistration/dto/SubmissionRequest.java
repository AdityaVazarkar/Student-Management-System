package com.Student.StudentRegistration.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    private Long homeworkId;
    private Long studentId;
    private String content;
    private String attachmentUrl;
}
