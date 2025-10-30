package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
	

	    private Long taskId;

	    private String title;

	    private String description;

	    private TaskStatus status = TaskStatus.TODO;

	    private LocalDate startDate;
	    private LocalDate dueDate;

	    private ProjectMemberDto assignedUser;
	    
	    private ProjectMemberDto creator;

	    private ProjectDto project;

	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;

}
