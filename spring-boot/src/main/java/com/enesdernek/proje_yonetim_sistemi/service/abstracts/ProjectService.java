package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;

public interface ProjectService {
	
	public ProjectDto create(Long userId, ProjectDtoIU projectDtoIU,MultipartFile projectImage);

}
