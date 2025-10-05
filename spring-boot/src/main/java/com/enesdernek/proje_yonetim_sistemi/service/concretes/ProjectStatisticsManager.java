package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectStatisticsDto;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectStatistics;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectStatisticsMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectStatisticsRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectStatisticsService;

@Service
public class ProjectStatisticsManager implements ProjectStatisticsService{
	
	@Autowired
	private ProjectStatisticsRepository projectStatisticsRepository;
	
	@Autowired
	private ProjectRepository projectRepository;
	
	@Autowired
	private ProjectStatisticsMapper projectStatisticsMapper;

	@Override
	public ProjectStatisticsDto create(Long projectId) {
		
		Project project = this.projectRepository.findById(projectId).orElseThrow(()->new NotFoundException("Proje bulunamadı."));
		ProjectStatistics statistics = new ProjectStatistics();
		statistics.setCompletedTasks(0);
		statistics.setCompletionRate(0);
		statistics.setPendingTasks(0);
		statistics.setProject(project);
		statistics.setTotalMembers(project.getMembers().size());
		statistics.setTotalTasks(0);
		this.projectStatisticsRepository.save(statistics);
		
		return this.projectStatisticsMapper.toDto(statistics);
	}

}
