package com.Student.StudentRegistration.controller;

import com.Student.StudentRegistration.entity.Classroom;
import com.Student.StudentRegistration.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    @GetMapping
    public ResponseEntity<List<Classroom>> getAllClasses() {
        return ResponseEntity.ok(classroomRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createClass(@RequestBody Classroom classroom) {
        if (classroom.getName() == null || classroom.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Class name is required"));
        }
        if (classroomRepository.existsByName(classroom.getName().trim())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Class already exists"));
        }
        classroom.setName(classroom.getName().trim());
        Classroom saved = classroomRepository.save(classroom);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        if (!classroomRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Class not found"));
        }
        classroomRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Class deleted successfully"));
    }
}
