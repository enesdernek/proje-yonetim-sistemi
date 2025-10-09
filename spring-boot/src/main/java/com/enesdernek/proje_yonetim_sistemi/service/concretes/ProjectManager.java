package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.nio.file.Paths;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectStatisticsRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.TaskRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectService;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectStatisticsService;

import jakarta.transaction.Transactional;

@Service
public class ProjectManager implements ProjectService{
	
	@Autowired
	private ProjectRepository projectRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ProjectMemberService projectMemberService;
	
	@Autowired
	private TaskRepository taskRepository;
	
	@Autowired
	private ProjectStatisticsService projectStatisticsService;
	
	@Autowired
	private FileStorageManager fileStorageManager;
	
	@Autowired
	private ProjectMapper projectMapper;

	@Override
	@Transactional
	public ProjectDto create(Long userId, ProjectDtoIU projectDtoIU, MultipartFile file) {
	    User creator = userRepository.findById(userId)
	            .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

	    String projectImageUrl = uploadProjectImage(null, file);
	    
	    Project project = projectMapper.toEntity(projectDtoIU);
	    System.out.println(project);
	    project.setProjectImageUrl(projectImageUrl);
	    project.setCreator(creator);
	    
	    project = this.projectRepository.save(project);
	    
	    projectMemberService.addCreatorAsProjectManagerAfterProjectCreate(project, creator);
	    
	    this.projectStatisticsService.create(project);

	    return projectMapper.toDto(project);
	}
	
	public String uploadProjectImage(String imageUrl, MultipartFile file) {
		
		if (imageUrl != null && !imageUrl.isEmpty()) {
			String oldFileName = Paths.get(imageUrl).getFileName().toString();
			this.fileStorageManager.deleteFileIfExist("project-images", oldFileName);
		}
		
		String newImageUrl = fileStorageManager.saveFile(file, "project-images");

		return newImageUrl;
	}
	

}
