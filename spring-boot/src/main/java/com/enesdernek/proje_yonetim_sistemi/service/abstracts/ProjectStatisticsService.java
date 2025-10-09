package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectStatisticsDto;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;

public interface ProjectStatisticsService {
	
	public ProjectStatisticsDto create(Project project);

}
