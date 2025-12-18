package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
	
	    private Long projectId;

	    private String name;

	    private String description;

	    private String projectImageUrl;

	    private LocalDate startDate;
	    
	    private LocalDate endDate;

	    private ProjectStatus status = ProjectStatus.PLANNING;

	    private Double progress = 0.0; 

	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;

	    private UserDto creator;

}
