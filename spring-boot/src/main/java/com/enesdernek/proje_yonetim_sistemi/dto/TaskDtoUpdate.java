package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDtoUpdate {
	
	@NotNull
	@Size(min=2,max=64)
	private String title;

	@NotNull
	@Size(min=2,max=512)
	private String description;


	private LocalDate dueDate;

}
