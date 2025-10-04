package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDtoIU {
	
    private String name;

    private String description;

    private LocalDate startDate;
    
    private LocalDate endDate;

    private Long cratorsUserId;

    private List<Long> memberIds;

}
