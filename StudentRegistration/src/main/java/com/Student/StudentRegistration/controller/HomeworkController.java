package com.Student.StudentRegistration.controller;

import com.Student.StudentRegistration.dto.HomeworkRequest;
import com.Student.StudentRegistration.entity.Homework;
import com.Student.StudentRegistration.service.HomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homework")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeworkController {

    private final HomeworkService homeworkService;

    @GetMapping
    public ResponseEntity<List<Homework>> getAllHomework() {
        return ResponseEntity.ok(homeworkService.getAllHomework());
    }

    @GetMapping("/class/{className}")
    public ResponseEntity<List<Homework>> getHomeworkForClass(@PathVariable String className) {
        return ResponseEntity.ok(homeworkService.getHomeworkForClass(className));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHomeworkById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(homeworkService.getHomeworkById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createHomework(@RequestBody HomeworkRequest request) {
        try {
            Homework created = homeworkService.createHomework(request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHomework(@PathVariable Long id, @RequestBody HomeworkRequest request) {
        try {
            Homework updated = homeworkService.updateHomework(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHomework(@PathVariable Long id) {
        try {
            homeworkService.deleteHomework(id);
            return ResponseEntity.ok(Map.of("message", "Homework deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
