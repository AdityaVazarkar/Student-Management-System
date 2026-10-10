package com.Student.StudentRegistration.config;

import com.Student.StudentRegistration.entity.*;
import com.Student.StudentRegistration.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;
    private final HomeworkRepository homeworkRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    public void run(String... args) {
        log.info("Checking and seeding default database records...");

        // 1. Seed Admin/Teacher
        if (!userRepository.existsByEmail("teacher@school.com")) {
            User teacher = User.builder()
                    .name("Prof. Sarah Jenkins")
                    .email("teacher@school.com")
                    .password("admin123")
                    .role(Role.ADMIN)
                    .phone("+1-555-0199")
                    .className("Faculty - Senior Department")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(teacher);
            log.info("Default teacher created: teacher@school.com / admin123");
        }

        // 2. Seed Classrooms
        if (classroomRepository.count() == 0) {
            classroomRepository.save(Classroom.builder()
                    .name("Grade 10 - Section A")
                    .section("10-A")
                    .description("Core Secondary Education - Batch Alpha")
                    .createdAt(LocalDateTime.now())
                    .build());

            classroomRepository.save(Classroom.builder()
                    .name("Grade 10 - Section B")
                    .section("10-B")
                    .description("Core Secondary Education - Batch Beta")
                    .createdAt(LocalDateTime.now())
                    .build());

            classroomRepository.save(Classroom.builder()
                    .name("Grade 11 - Science")
                    .section("11-SCI")
                    .description("Higher Secondary Science stream (Physics, Chemistry, Maths)")
                    .createdAt(LocalDateTime.now())
                    .build());

            classroomRepository.save(Classroom.builder()
                    .name("Grade 12 - Commerce")
                    .section("12-COM")
                    .description("Senior Secondary Commerce & Economics")
                    .createdAt(LocalDateTime.now())
                    .build());
            log.info("Default classrooms created");
        }

        // 3. Seed Students
        User alex = null;
        User emma = null;
        if (!userRepository.existsByEmail("alex@student.com")) {
            alex = userRepository.save(User.builder()
                    .name("Alex Rivera")
                    .email("alex@student.com")
                    .password("student123")
                    .role(Role.STUDENT)
                    .rollNumber("STU-1001")
                    .className("Grade 10 - Section A")
                    .phone("+1-555-0101")
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());
        } else {
            alex = userRepository.findByEmail("alex@student.com").orElse(null);
        }

        if (!userRepository.existsByEmail("emma@student.com")) {
            emma = userRepository.save(User.builder()
                    .name("Emma Watson")
                    .email("emma@student.com")
                    .password("student123")
                    .role(Role.STUDENT)
                    .rollNumber("STU-1002")
                    .className("Grade 10 - Section A")
                    .phone("+1-555-0102")
                    .createdAt(LocalDateTime.now().minusDays(8))
                    .build());
        } else {
            emma = userRepository.findByEmail("emma@student.com").orElse(null);
        }

        if (!userRepository.existsByEmail("liam@student.com")) {
            userRepository.save(User.builder()
                    .name("Liam Chen")
                    .email("liam@student.com")
                    .password("student123")
                    .role(Role.STUDENT)
                    .rollNumber("STU-1101")
                    .className("Grade 11 - Science")
                    .phone("+1-555-0103")
                    .createdAt(LocalDateTime.now().minusDays(5))
                    .build());
        }

        if (!userRepository.existsByEmail("sophia@student.com")) {
            userRepository.save(User.builder()
                    .name("Sophia Patel")
                    .email("sophia@student.com")
                    .password("student123")
                    .role(Role.STUDENT)
                    .rollNumber("STU-1201")
                    .className("Grade 12 - Commerce")
                    .phone("+1-555-0104")
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .build());
        }

        // 4. Seed Homework
        Homework hw1 = null;
        if (homeworkRepository.count() == 0) {
            hw1 = homeworkRepository.save(Homework.builder()
                    .title("Algebra: Quadratic Equations Problem Set")
                    .description("Solve exercises 4.1 to 4.5 from chapter 4. Show complete step-by-step factorization and quadratic formula derivations.")
                    .subject("Mathematics")
                    .targetClass("Grade 10 - Section A")
                    .dueDate(LocalDate.now().plusDays(5))
                    .maxPoints(100)
                    .teacherName("Prof. Sarah Jenkins")
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .build());

            homeworkRepository.save(Homework.builder()
                    .title("Newtonian Physics & Force Vector Diagrams")
                    .description("Draw free-body diagrams for inclined plane friction scenarios and calculate acceleration vectors.")
                    .subject("Physics")
                    .targetClass("Grade 11 - Science")
                    .dueDate(LocalDate.now().plusDays(7))
                    .maxPoints(100)
                    .teacherName("Prof. Sarah Jenkins")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build());

            homeworkRepository.save(Homework.builder()
                    .title("Literary Analysis: Themes of Empathy")
                    .description("Write a 500-word essay analyzing Atticus Finch's advice regarding moral perspective and empathy in 'To Kill a Mockingbird'.")
                    .subject("English Literature")
                    .targetClass("ALL")
                    .dueDate(LocalDate.now().plusDays(3))
                    .maxPoints(50)
                    .teacherName("Prof. Sarah Jenkins")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build());
            log.info("Default homework created");
        }

        // 5. Seed sample submissions if empty
        if (submissionRepository.count() == 0 && hw1 != null && alex != null && emma != null) {
            // Alex has a graded submission
            submissionRepository.save(Submission.builder()
                    .homeworkId(hw1.getId())
                    .homeworkTitle(hw1.getTitle())
                    .studentId(alex.getId())
                    .studentName(alex.getName())
                    .studentEmail(alex.getEmail())
                    .studentRollNumber(alex.getRollNumber())
                    .studentClass(alex.getClassName())
                    .content("I have solved all 15 quadratic equations using both the quadratic formula and factorization. All root proofs verified with discriminant checks.")
                    .attachmentUrl("https://drive.google.com/sample-alex-math-solution.pdf")
                    .submittedAt(LocalDateTime.now().minusDays(1))
                    .status(SubmissionStatus.GRADED)
                    .grade(96)
                    .feedback("Superb clarity in your factoring steps! Spotless work on problem #12.")
                    .gradedAt(LocalDateTime.now().minusHours(4))
                    .build());

            // Emma has a pending submission
            submissionRepository.save(Submission.builder()
                    .homeworkId(hw1.getId())
                    .homeworkTitle(hw1.getTitle())
                    .studentId(emma.getId())
                    .studentName(emma.getName())
                    .studentEmail(emma.getEmail())
                    .studentRollNumber(emma.getRollNumber())
                    .studentClass(emma.getClassName())
                    .content("Completed exercises 4.1 through 4.5. Attached my derivation notes for complex conjugates.")
                    .attachmentUrl("https://github.com/sample-emma-solution")
                    .submittedAt(LocalDateTime.now().minusHours(2))
                    .status(SubmissionStatus.SUBMITTED)
                    .build());
            log.info("Default submissions seeded");
        }
    }
}
