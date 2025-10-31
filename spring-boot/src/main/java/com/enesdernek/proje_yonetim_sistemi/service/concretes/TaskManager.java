package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.Task;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
import com.enesdernek.proje_yonetim_sistemi.mapper.TaskMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.TaskRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
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

	@Autowired
	private UserRepository userRepository;

	@Override
	public TaskDto createTask(Long authUserId, TaskDtoIU taskDtoIU) {

		Project project = this.projectRepository.findById(taskDtoIU.getProjectId())
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı"));

		ProjectMember manager = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(authUserId, taskDtoIU.getProjectId())
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		if (!manager.getRole().equals(ProjectRole.MANAGER)) {
			throw new UnauthorizedActionException("Görev oluşturma yetkiniz yok.");
		}

		ProjectMember assignedMember = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(taskDtoIU.getAssignedUserId(), taskDtoIU.getProjectId())
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		Task task = this.taskMapper.toEntity(taskDtoIU);

		task.setCreator(manager);

		task.setProject(project);

		task.setAssignedUser(assignedMember);

		this.taskRepository.save(task);

		return this.taskMapper.toDto(task);
	}

	@Override
	public TaskDto getTaskById(Long authUserId, Long taskId) {
		User user = this.userRepository.findById(authUserId)
				.orElseThrow(() -> new NotFoundException("User bulunamadı"));

		Task task = this.taskRepository.findById(taskId).orElseThrow(() -> new NotFoundException("Görev bulunamadı"));
		return this.taskMapper.toDto(task);
	}

	@Override
	public TaskDtoPagedResponse getTasksByProjectId(Long authUserId, Long projectId, int pageNo, int pageSize) {

		ProjectMember member = this.projectMemberRepository.findById(authUserId)
				.orElseThrow(() -> new NotFoundException("üye bulunamadı."));

		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı"));

		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
		List<Task> tasks = this.taskRepository.getTasksByProjectIdPaged(projectId, pageable);
		TaskDtoPagedResponse response = new TaskDtoPagedResponse();
		response.setTaskDtos(this.taskMapper.toDtoList(tasks));

		Long totalElements = this.taskRepository.countTasksByProjectId(projectId);
		response.setTotalElements(totalElements);

		int totalPages = (int) Math.ceil((double) totalElements / pageSize);
		response.setTotalPages(totalPages);
		return response;
	}

	@Override
	public TaskDtoPagedResponse getProjectTasksAssignedToProjectMember(Long authUserId, Long projectId, int pageNo,
			int pageSize) {

		ProjectMember member = this.projectMemberRepository.findById(authUserId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı."));

		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı"));

		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);

		Page<Task> tasks = this.taskRepository.getTasksByProjectIdAndProjectMemberId(projectId, member.getMemberId(),
				pageable);

		TaskDtoPagedResponse response = new TaskDtoPagedResponse();
		List<TaskDto> taskDtos = tasks.hasContent() ? this.taskMapper.toDtoList(tasks.getContent()) : new ArrayList<>();
		response.setTaskDtos(taskDtos);
		response.setTotalElements(tasks.getTotalElements());
		response.setTotalPages(tasks.getTotalPages());
		response.setTotalPages(tasks.getTotalPages());
		return response;
	}

	public TaskDtoPagedResponse getTasksAssignedToUser(Long authUserId, Long userId, int pageNo, int pageSize) {
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
