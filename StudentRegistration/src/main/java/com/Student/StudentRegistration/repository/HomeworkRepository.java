package com.Student.StudentRegistration.repository;

import com.Student.StudentRegistration.entity.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findAllByOrderByCreatedAtDesc();

    @Query("SELECT h FROM Homework h WHERE h.targetClass = 'ALL' OR h.targetClass = :className ORDER BY h.dueDate ASC")
    List<Homework> findForClass(@Param("className") String className);
}
