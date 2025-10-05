package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDtoIU {
	
	@Size(min=2,max=128)
	@NotNull
	@NotBlank
    private String name;

	@Size(min=8,max=1024)
	@NotNull
	@NotBlank
    private String description;
    
    private List<ProjectMemberRequest> members; 

}
