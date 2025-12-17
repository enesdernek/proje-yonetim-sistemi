package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessResult;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;
	
	@DeleteMapping("/delete-task")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessResult> deleteTask(Authentication auth, Long taskId) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		this.taskService.deleteTask(authUserId, taskId);
		
		SuccessResult result = new SuccessResult("Görev başarıyla silindi.");
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PutMapping("/change-task-status")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDto>> changeTaskStatus(Authentication auth,Long taskId,TaskStatus taskStatus) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.changeTaskStatus(authUserId, taskId, taskStatus),
				"Görev başarıyla güncellendi.");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PutMapping("/change-task-status-to-in-progress")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDto>> changeTaskStatusToInProgress(Authentication auth, Long taskId) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.changeTaskStatusToInProgress(authUserId, taskId),
				"Görev başarıyla güncellendi.");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PutMapping("/update-task")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDto>> updateTask(Authentication auth, Long taskId,@Valid TaskDtoIU taskDtoIU) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.updateTask(authUserId, taskId, taskDtoIU),
				"Görev başarıyla güncellendi.");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@GetMapping("get-all-tasks-by-status")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDtoPagedResponse>> getAllTasksByStatus(Authentication auth, Long projectId, TaskStatus status,int pageNo, int pageSize) {
		
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		SuccessDataResult<TaskDtoPagedResponse> result = new SuccessDataResult<>(this.taskService.getAllTasksByStatus(authUserId, projectId, status, pageNo, pageSize),
				"Görevler başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@GetMapping("get-users-all-tasks")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDtoPagedResponse>> getUsersAllTasks(Authentication auth, int pageNo, int pageSize) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();
		
		SuccessDataResult<TaskDtoPagedResponse> result = new SuccessDataResult<>(this.taskService.getUsersAllTasks(authUserId, pageNo, pageSize),
				"Görevler başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping("/create-task")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDto>> createTask(Authentication auth, @Valid @RequestBody TaskDtoIU taskDtoIU) {

		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.createTask(authUserId, taskDtoIU),
				"Görev başarıyla oluşturuldu");

		return new ResponseEntity<>(result, HttpStatus.CREATED);

	}

	@GetMapping("/get-by-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDto>> getTaskById(Authentication auth, Long taskId) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.getTaskById(authUserId, taskId),
				"Görev başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);

	}

	@GetMapping("/get-all-tasks-by-project-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDtoPagedResponse>> getTasksByProjectId(Authentication auth,
			Long projectId, int pageNo, int pageSize) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDtoPagedResponse> result = new SuccessDataResult<>(
				this.taskService.getTasksByProjectId(authUserId, projectId, pageNo, pageSize),
				"Görevler başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@GetMapping("/get-all-project-tasks-assigned-to-member")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<TaskDtoPagedResponse>> getProjectTasksAssignedToProjectMember(
			Authentication auth, Long projectId, int pageNo, int pageSize) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDtoPagedResponse> result = new SuccessDataResult<>(
				this.taskService.getProjectTasksAssignedToProjectMember(authUserId, projectId, pageNo, pageSize),
				"Görevler başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);
	}

}
