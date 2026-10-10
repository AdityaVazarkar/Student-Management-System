package com.Student.StudentRegistration.service;

import com.Student.StudentRegistration.dto.AssignClassRequest;
import com.Student.StudentRegistration.dto.StudentUpdateRequest;
import com.Student.StudentRegistration.entity.Role;
import com.Student.StudentRegistration.entity.User;
import com.Student.StudentRegistration.repository.SubmissionRepository;
import com.Student.StudentRegistration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<User> getStudentsByClass(String className) {
        return userRepository.findByRoleAndClassName(Role.STUDENT, className);
    }

    public User getStudentById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
    }

    public User updateStudent(Long id, StudentUpdateRequest request) {
        User student = getStudentById(id);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            student.setName(request.getName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equals(student.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email already in use: " + newEmail);
            }
            student.setEmail(newEmail);
        }
        if (request.getRollNumber() != null) {
            student.setRollNumber(request.getRollNumber().trim());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone().trim());
        }
        if (request.getClassName() != null) {
            student.setClassName(request.getClassName().trim());
        }

        return userRepository.save(student);
    }

    public User createStudent(StudentUpdateRequest request) {
        if (request.getEmail() == null || request.getName() == null) {
            throw new IllegalArgumentException("Name and email are required");
        }
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        User student = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password("student123")
                .role(Role.STUDENT)
                .rollNumber(request.getRollNumber() != null && !request.getRollNumber().trim().isEmpty() ? request.getRollNumber().trim() : "STU-" + System.currentTimeMillis() % 100000)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .className(request.getClassName() != null && !request.getClassName().trim().isEmpty() ? request.getClassName().trim() : "Grade 10 - Section A")
                .build();
        return userRepository.save(student);
    }

    public User assignClass(Long id, AssignClassRequest request) {
        User student = getStudentById(id);
        String targetClass = request.getClassName() != null ? request.getClassName().trim() : "Unassigned";
        student.setClassName(targetClass);
        return userRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        User student = getStudentById(id);
        submissionRepository.deleteByStudentId(id);
        userRepository.delete(student);
    }
}
