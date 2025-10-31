package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import java.util.List;

import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;

public interface TaskService {

	public TaskDto createTask(Long authUserId,TaskDtoIU taskDtoIU);

	public TaskDto getTaskById(Long authUserId, Long taskId);

	public TaskDtoPagedResponse getTasksByProjectId(Long authUserId, Long projectId, int pageNo, int pageSize);

	public TaskDtoPagedResponse getProjectTasksAssignedToProjectMember(Long authUserId, Long projectId, int pageNo, int pageSize);
	
	public TaskDtoPagedResponse getTasksAssignedToUser(Long authUserId, Long userId, int pageNo, int pageSize);

	public List<TaskDto> getAllTasksByStatus(Long authUserId, Long projectId, TaskStatus status);

	public TaskDto updateTask(Long authUserId, Long taskId, TaskDtoIU taskDtoIU);

	public TaskDto changeTaskStatus(Long authUserId, Long taskId, TaskStatus status);

	public TaskDto assignTaskToMember(Long authUserId, Long taskId, Long memberId);

	public void deleteTask(Long authUserId, Long taskId);
}
