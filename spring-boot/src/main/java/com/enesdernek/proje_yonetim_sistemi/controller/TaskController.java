package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.service.abstracts.TaskService;

@RestController
@RequestMapping(path="/api/tasks")
public class TaskController {
	
	@Autowired
	private TaskService taskService;

}
