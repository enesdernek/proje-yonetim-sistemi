package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import java.util.List;

import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoUpdate;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;

public interface TaskService {

	public TaskDto createTask(Long authUserId,TaskDtoIU taskDtoIU);

	public TaskDto getTaskById(Long authUserId, Long taskId);

	public TaskDtoPagedResponse getTasksByProjectId(Long authUserId, Long projectId, int pageNo, int pageSize);

	public TaskDtoPagedResponse getAuthenticatedMembersTasksByProject(Long authUserId, Long projectId, int pageNo, int pageSize);
	
	public TaskDtoPagedResponse getUsersAllTasks( Long userId, int pageNo, int pageSize);

	public TaskDtoPagedResponse getAllProjectTasksByStatus(Long authUserId, Long projectId, TaskStatus status,int pageNo, int pageSize);
	
	public TaskDto updateTask(Long authUserId, Long taskId, TaskDtoIU taskDtoIU);

	public TaskDto changeTaskStatusToInProgress(Long authUserId, Long taskId);
	
	public TaskDto changeTaskStatusToDone(Long authUserId,Long taskId);
	
	public TaskDto changeTaskStatus(Long authUserId,Long taskId,TaskStatus taskStatus);
	
	public void deleteTask(Long authUserId, Long taskId);
	
	public TaskDtoPagedResponse getAllProjectMembersTaskByProject(Long authUserId,Long assignedMemberId,Long projectId,int pageNo, int pageSize);

}
