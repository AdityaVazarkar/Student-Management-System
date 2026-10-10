package com.Student.StudentRegistration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalStudents;
    private long totalClasses;
    private long totalHomework;
    private long totalSubmissions;
    private long pendingSubmissions;
    private long gradedSubmissions;
}
