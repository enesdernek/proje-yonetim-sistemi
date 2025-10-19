package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDtoIU {

	@NotNull
	@Size(min=2,max=64)
	private String title;

	@NotNull
	@Size(min=2,max=512)
	private String description;

	private TaskStatus status = TaskStatus.TODO;

	private LocalDate startDate;
	private LocalDate dueDate;

	private Integer progress = 0;

	private Long assignedUserId;
	
	private Long projectId;
	

}
