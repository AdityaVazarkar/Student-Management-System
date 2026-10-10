package com.Student.StudentRegistration.repository;

import com.Student.StudentRegistration.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    List<Submission> findByHomeworkIdOrderBySubmittedAtDesc(Long homeworkId);
    Optional<Submission> findByHomeworkIdAndStudentId(Long homeworkId, Long studentId);
    void deleteByStudentId(Long studentId);
    void deleteByHomeworkId(Long homeworkId);
}
