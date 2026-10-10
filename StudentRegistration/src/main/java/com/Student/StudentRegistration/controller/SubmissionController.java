package com.Student.StudentRegistration.controller;

import com.Student.StudentRegistration.dto.GradeRequest;
import com.Student.StudentRegistration.dto.SubmissionRequest;
import com.Student.StudentRegistration.entity.Submission;
import com.Student.StudentRegistration.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<?> submitHomework(@RequestBody SubmissionRequest request) {
        try {
            Submission saved = submissionService.submitHomework(request);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getStudentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(studentId));
    }

    @GetMapping("/homework/{homeworkId}")
    public ResponseEntity<List<Submission>> getHomeworkSubmissions(@PathVariable Long homeworkId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByHomework(homeworkId));
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody GradeRequest request) {
        try {
            Submission graded = submissionService.gradeSubmission(id, request);
            return ResponseEntity.ok(graded);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
