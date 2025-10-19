package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;
import com.enesdernek.proje_yonetim_sistemi.mapper.TaskMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.TaskRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.TaskService;

@Service
public class TaskManager implements TaskService {
	
	@Autowired
	private TaskRepository taskRepository;
	
	@Autowired
	private TaskMapper taskMapper;
	
	@Autowired
	private ProjectMemberRepository projectMemberRepository;
	
	@Autowired
	private ProjectRepository projectRepository;

	@Override
	public TaskDto createTask(Long authUserId, Long projectId, TaskDtoIU taskDtoIU) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDto getTaskById(Long authUserId, Long taskId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDtoPagedResponse getTasksByProjectId(Long authUserId, Long projectId, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDtoPagedResponse getTasksAssignedToUser(Long authUserId, Long userId, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<TaskDto> getAllTasksByStatus(Long authUserId, Long projectId, TaskStatus status) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDto updateTask(Long authUserId, Long taskId, TaskDtoIU taskDtoIU) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDto changeTaskStatus(Long authUserId, Long taskId, TaskStatus status) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public TaskDto assignTaskToMember(Long authUserId, Long taskId, Long memberId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteTask(Long authUserId, Long taskId) {
		// TODO Auto-generated method stub
		
	}
	

}
