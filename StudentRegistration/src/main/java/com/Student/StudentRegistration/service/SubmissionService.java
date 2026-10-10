package com.Student.StudentRegistration.service;

import com.Student.StudentRegistration.dto.GradeRequest;
import com.Student.StudentRegistration.dto.SubmissionRequest;
import com.Student.StudentRegistration.entity.Homework;
import com.Student.StudentRegistration.entity.Submission;
import com.Student.StudentRegistration.entity.SubmissionStatus;
import com.Student.StudentRegistration.entity.User;
import com.Student.StudentRegistration.repository.HomeworkRepository;
import com.Student.StudentRegistration.repository.SubmissionRepository;
import com.Student.StudentRegistration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final HomeworkRepository homeworkRepository;
    private final UserRepository userRepository;

    public Submission submitHomework(SubmissionRequest request) {
        if (request.getHomeworkId() == null || request.getStudentId() == null) {
            throw new IllegalArgumentException("Homework ID and Student ID are required");
        }
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Submission content or solution cannot be empty");
        }

        Homework homework = homeworkRepository.findById(request.getHomeworkId())
                .orElseThrow(() -> new IllegalArgumentException("Homework not found with ID: " + request.getHomeworkId()));

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));

        Optional<Submission> existing = submissionRepository.findByHomeworkIdAndStudentId(request.getHomeworkId(), request.getStudentId());

        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setContent(request.getContent().trim());
            submission.setAttachmentUrl(request.getAttachmentUrl());
            submission.setSubmittedAt(LocalDateTime.now());
            submission.setStatus(SubmissionStatus.SUBMITTED);
        } else {
            submission = Submission.builder()
                    .homeworkId(homework.getId())
                    .homeworkTitle(homework.getTitle())
                    .studentId(student.getId())
                    .studentName(student.getName())
                    .studentEmail(student.getEmail())
                    .studentRollNumber(student.getRollNumber())
                    .studentClass(student.getClassName())
                    .content(request.getContent().trim())
                    .attachmentUrl(request.getAttachmentUrl())
                    .submittedAt(LocalDateTime.now())
                    .status(SubmissionStatus.SUBMITTED)
                    .build();
        }

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentIdOrderBySubmittedAtDesc(studentId);
    }

    public List<Submission> getSubmissionsByHomework(Long homeworkId) {
        return submissionRepository.findByHomeworkIdOrderBySubmittedAtDesc(homeworkId);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Submission gradeSubmission(Long submissionId, GradeRequest request) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        submission.setGrade(request.getGrade());
        submission.setFeedback(request.getFeedback());
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setGradedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }
}
