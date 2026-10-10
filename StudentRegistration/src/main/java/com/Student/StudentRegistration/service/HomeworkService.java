package com.Student.StudentRegistration.service;

import com.Student.StudentRegistration.dto.HomeworkRequest;
import com.Student.StudentRegistration.entity.Homework;
import com.Student.StudentRegistration.repository.HomeworkRepository;
import com.Student.StudentRegistration.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final SubmissionRepository submissionRepository;

    public List<Homework> getAllHomework() {
        return homeworkRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Homework> getHomeworkForClass(String className) {
        if (className == null || className.trim().isEmpty() || "Unassigned".equalsIgnoreCase(className)) {
            return homeworkRepository.findForClass("ALL");
        }
        return homeworkRepository.findForClass(className.trim());
    }

    public Homework getHomeworkById(Long id) {
        return homeworkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Homework not found with ID: " + id));
    }

    public Homework createHomework(HomeworkRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Homework title is required");
        }
        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required");
        }

        Homework homework = Homework.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .subject(request.getSubject().trim())
                .targetClass(request.getTargetClass() != null && !request.getTargetClass().trim().isEmpty() ? request.getTargetClass().trim() : "ALL")
                .dueDate(request.getDueDate())
                .maxPoints(request.getMaxPoints() != null ? request.getMaxPoints() : 100)
                .teacherName(request.getTeacherName() != null ? request.getTeacherName().trim() : "Admin Teacher")
                .build();

        return homeworkRepository.save(homework);
    }

    public Homework updateHomework(Long id, HomeworkRequest request) {
        Homework homework = getHomeworkById(id);

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            homework.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            homework.setDescription(request.getDescription());
        }
        if (request.getSubject() != null && !request.getSubject().trim().isEmpty()) {
            homework.setSubject(request.getSubject().trim());
        }
        if (request.getTargetClass() != null && !request.getTargetClass().trim().isEmpty()) {
            homework.setTargetClass(request.getTargetClass().trim());
        }
        if (request.getDueDate() != null) {
            homework.setDueDate(request.getDueDate());
        }
        if (request.getMaxPoints() != null) {
            homework.setMaxPoints(request.getMaxPoints());
        }

        return homeworkRepository.save(homework);
    }

    @Transactional
    public void deleteHomework(Long id) {
        Homework homework = getHomeworkById(id);
        submissionRepository.deleteByHomeworkId(id);
        homeworkRepository.delete(homework);
    }
}
