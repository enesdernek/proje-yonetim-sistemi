package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@PostMapping("/create-task")
	public ResponseEntity<SuccessDataResult<TaskDto>> createTask(Authentication auth, @Valid TaskDtoIU taskDtoIU) {

		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.createTask(authUserId, taskDtoIU),
				"Görev başarıyla oluşturuldu");

		return new ResponseEntity<>(result, HttpStatus.CREATED);

	}

	@GetMapping("/get-by-id")
	public ResponseEntity<SuccessDataResult<TaskDto>> getTaskById(Authentication auth, Long taskId) {
		User user = (User) auth.getPrincipal();
		Long authUserId = user.getUserId();

		SuccessDataResult<TaskDto> result = new SuccessDataResult<>(this.taskService.getTaskById(authUserId, taskId),
				"Görev başarıyla getirildi");

		return new ResponseEntity<>(result, HttpStatus.OK);

	}

}
