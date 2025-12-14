package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectListDtoPagedResponse;

public interface ProjectService {
	
	public ProjectDto create(Long userId, ProjectDtoIU projectDtoIU,MultipartFile projectImage);
	
	public ProjectDto uploadImage(Long userId,Long projectId,MultipartFile projectImage);
	
	public ProjectDto deleteImage(Long userId,Long projectId);
	
	public ProjectDto startProject(Long userId,Long projectId);
	
	public ProjectDto onHoldProject(Long userId,Long projectId);
	
	public ProjectDto cancelProject(Long userId, Long projectId);
	
	public ProjectDto completeProject(Long userId, Long projectId);

	public ProjectDto updateProject(Long userId,Long projectId,ProjectDtoIU projectDtoIU);
	
	public ProjectListDtoPagedResponse getProjectsByUserId(Long userId,int pageNo, int pageSize);
	
	public ProjectDto getByProjectId(Long userId,Long projectId);
	
	public void deleteProjectByProjectId(Long projectId);
	
	public ProjectDto restartProject(Long userId,Long projectId);

}
