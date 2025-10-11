package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectStatus;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.BusinessException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
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
public class ProjectManager implements ProjectService {

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProjectMemberService projectMemberService;

	@Autowired
	private ProjectMemberRepository projectMemberRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private ProjectStatisticsService projectStatisticsService;

	@Autowired
	private FileStorageManager fileStorageManager;

	@Autowired
	private ProjectMapper projectMapper;

	private ProjectStatus projectStatus;
	
	@Override
	public ProjectDto completeProject(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}
		
		ProjectStatus current = project.getStatus();
		
		if(current == ProjectStatus.CANCELLED) {
			throw new BusinessException("Proje zaten iptal edilmiş.");
		}
		
		if(current == ProjectStatus.COMPLETED) {
			throw new BusinessException("Proje zaten tamamlanmış.");
		}
		
		if(current == ProjectStatus.PLANNING) {
			throw new BusinessException("Projeyi bitirmek için öncelikle başlatmalısınız.");
		}
		
		project.setStatus(ProjectStatus.COMPLETED);
		project.setEndDate(LocalDate.now());
		this.projectRepository.save(project);
		
		return this.projectMapper.toDto(project);	
	}
	
	@Override
	public ProjectDto cancelProject(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}
		
		ProjectStatus current = project.getStatus();
		
		if(current == ProjectStatus.CANCELLED) {
			throw new BusinessException("Proje zaten iptal edilmiş.");
		}
		
		if(current == ProjectStatus.COMPLETED) {
			throw new BusinessException("Proje zaten tamamlanmış.");
		}
		
		project.setStatus(ProjectStatus.CANCELLED);
		project.setEndDate(LocalDate.now());
		this.projectRepository.save(project);
		
		return this.projectMapper.toDto(project);	
	}

	@Override
	public ProjectDto onHoldProject(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}
		
		ProjectStatus current = project.getStatus();
		
		if(current == ProjectStatus.PLANNING) {
			throw new BusinessException("Projeyi beklemeye almak için öncelikle projeyi başlatmanız gerekir.");
		}
		
		if(current == ProjectStatus.CANCELLED || current == ProjectStatus.COMPLETED) {
			throw new BusinessException("Tamamlanmış veya iptal edilmiş projeyi beklemeye alamazsınız.");
		}
		
		project.setStatus(ProjectStatus.ON_HOLD);
		this.projectRepository.save(project);
		
		return this.projectMapper.toDto(project);
	}

	@Override
	public ProjectDto startProject(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}

		project.setStartDate(LocalDate.now());
		project.setStatus(projectStatus.IN_PROGRESS);

		this.projectRepository.save(project);

		return this.projectMapper.toDto(project);
	}

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

	@Override
	public ProjectDto uploadImage(Long userId, Long projectId, MultipartFile projectImage) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}

		String projectImageUrl = uploadProjectImage(project.getProjectImageUrl(), projectImage);

		project.setProjectImageUrl(projectImageUrl);
		this.projectRepository.save(project);

		return this.projectMapper.toDto(project);
	}

	@Override
	public ProjectDto deleteImage(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember projectMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Proje üyesi bulunamadı."));

		if (projectMember.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi gerçekleştirmeye yetkiniz yok.");
		}

		String imageUrl = project.getProjectImageUrl();

		if (imageUrl != null && !imageUrl.isEmpty()) {
			String fileName = Paths.get(imageUrl).getFileName().toString();
			this.fileStorageManager.deleteFileIfExist("project-images", fileName);
			project.setProjectImageUrl(null);
			this.projectRepository.save(project);
		}

		return this.projectMapper.toDto(project);
	}

	

	

}
