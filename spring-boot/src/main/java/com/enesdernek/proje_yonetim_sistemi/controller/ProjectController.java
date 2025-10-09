package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping(path = "/api/projects")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	

	@PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> createProject(
	        @RequestPart("project") String projectJson,
	        @RequestPart(value = "file", required = false) MultipartFile file,
	        Authentication authentication
	) throws JsonProcessingException {
	    User user = (User) authentication.getPrincipal();
	    Long userId = user.getUserId();

	    ObjectMapper objectMapper = new ObjectMapper();
	    ProjectDtoIU projectDtoIU = objectMapper.readValue(projectJson, ProjectDtoIU.class);

	    ProjectDto createdProject = projectService.create(userId, projectDtoIU, file);
	    return ResponseEntity.status(HttpStatus.CREATED)
	            .body(new SuccessDataResult<>(createdProject, "Proje başarıyla oluşturuldu."));
	}
}
