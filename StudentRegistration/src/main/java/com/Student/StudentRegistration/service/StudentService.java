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
