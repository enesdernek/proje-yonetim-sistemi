package com.enesdernek.proje_yonetim_sistemi.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectStatisticsDto {

	    private Long statsId;


	    private ProjectDto projectDto;

	    private int totalTasks = 0;
	    private int completedTasks = 0;
	    private int pendingTasks = 0;

	    private double completionRate = 0.0; 

	    private int totalMembers = 0;
}
