package com.Student.StudentRegistration.controller;

import com.Student.StudentRegistration.dto.DashboardStatsDto;
import com.Student.StudentRegistration.entity.Role;
import com.Student.StudentRegistration.entity.Submission;
import com.Student.StudentRegistration.entity.SubmissionStatus;
import com.Student.StudentRegistration.repository.ClassroomRepository;
import com.Student.StudentRegistration.repository.HomeworkRepository;
import com.Student.StudentRegistration.repository.SubmissionRepository;
import com.Student.StudentRegistration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;
    private final HomeworkRepository homeworkRepository;
    private final SubmissionRepository submissionRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        long studentCount = userRepository.findByRole(Role.STUDENT).size();
        long classCount = classroomRepository.count();
        long homeworkCount = homeworkRepository.count();

        List<Submission> allSubs = submissionRepository.findAll();
        long totalSubs = allSubs.size();
        long gradedSubs = allSubs.stream().filter(s -> s.getStatus() == SubmissionStatus.GRADED).count();
        long pendingSubs = totalSubs - gradedSubs;

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalStudents(studentCount)
                .totalClasses(classCount)
                .totalHomework(homeworkCount)
                .totalSubmissions(totalSubs)
                .pendingSubmissions(pendingSubs)
                .gradedSubmissions(gradedSubs)
                .build();

        return ResponseEntity.ok(stats);
    }
}
