package com.Student.StudentRegistration.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long homeworkId;

    private String homeworkTitle;

    @Column(nullable = false)
    private Long studentId;

    private String studentName;

    private String studentEmail;

    private String studentRollNumber;

    private String studentClass;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String attachmentUrl;

    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    private Integer grade;

    private String feedback;

    private LocalDateTime gradedAt;

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SubmissionStatus.SUBMITTED;
        }
    }
}
