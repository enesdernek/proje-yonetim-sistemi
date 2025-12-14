package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectListDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/projects")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	
	@DeleteMapping("/delete-project-by-project-id")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<SuccessResult> deleteProjectByProjectId(Long projectId) {
		
		this.projectService.deleteProjectByProjectId(projectId);
		SuccessResult result = new SuccessResult("Proje başarıyla silindi.");
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/get-project-by-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> getByProjectId(Authentication auth,@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.getByProjectId(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto,
				"Proje başarıyla getirildi.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@GetMapping("/get-projects-by-user-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectListDtoPagedResponse>> getProjectsByUserId(Authentication auth, @RequestParam int pageNo,
			@RequestParam int pageSize) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		SuccessDataResult<ProjectListDtoPagedResponse> result = new SuccessDataResult<ProjectListDtoPagedResponse>(
				this.projectService.getProjectsByUserId(userId, pageNo, pageSize),
				"Kullanıcının üye olduğu projeler getirildi.");
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping("/update-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> updateProject(Authentication auth, Long projectId,
			@RequestBody @Valid ProjectDtoIU projectDtoIU) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.updateProject(userId, projectId, projectDtoIU);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto,
				"Proje bilgileri başarıyla güncellendi.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping("/complete-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> completeProject(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.completeProject(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto, "Proje başarıyla tamamlandı.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping("/cancel-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> cancelProject(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.cancelProject(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto, "Proje başarıyla iptal edildi.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping("/onhold-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> onHoldProject(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.onHoldProject(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto,
				"Proje başarıyla beklemeye alındı.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping("/start-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> startProject(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.startProject(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto, "Proje başarıyla başlatıldı.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PutMapping("/restart-project")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> restartProject(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.restartProject(userId, projectId);
		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto, "Proje başarıyla başlatıldı.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@DeleteMapping(value = "/delete-project-image")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> deleteImage(Authentication auth,
			@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.deleteImage(userId, projectId);

		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto, "Proje resmi başarıyla silindi.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PutMapping(value = "/upload-project-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> uploadImage(Authentication auth, @RequestParam Long projectId,
			@RequestParam("file") MultipartFile file) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();

		ProjectDto dto = this.projectService.uploadImage(userId, projectId, file);

		SuccessDataResult<ProjectDto> result = new SuccessDataResult<ProjectDto>(dto,
				"Proje resmi başarıyla güncellendi.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectDto>> createProject(@RequestPart("project") String projectJson,
			@RequestPart(value = "file", required = false) MultipartFile file, Authentication authentication)
			throws JsonProcessingException {
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		ObjectMapper objectMapper = new ObjectMapper();
		ProjectDtoIU projectDtoIU = objectMapper.readValue(projectJson, ProjectDtoIU.class);

		ProjectDto createdProject = projectService.create(userId, projectDtoIU, file);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new SuccessDataResult<>(createdProject, "Proje başarıyla oluşturuldu."));
	}

}
