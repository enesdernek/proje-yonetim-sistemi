package com.enesdernek.proje_yonetim_sistemi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_statistics")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statsId;

    @OneToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private int totalTasks = 0;
    private int completedTasks = 0;
    private int pendingTasks = 0;

    private double completionRate = 0.0;

    private int totalMembers = 0;
}