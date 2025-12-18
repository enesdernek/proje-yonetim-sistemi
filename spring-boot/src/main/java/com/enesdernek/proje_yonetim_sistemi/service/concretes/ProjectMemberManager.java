package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.BusinessException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectMemberMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.TaskRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;

import jakarta.transaction.Transactional;

@Service
public class ProjectMemberManager implements ProjectMemberService {

	@Autowired
	private ProjectMemberRepository projectMemberRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ProjectMemberMapper projectMemberMapper;

	@Autowired
	private ConnectionRepository connectionRepository;
	
	@Autowired
	private TaskRepository taskRepository;

	@Override
	public void addCreatorAsProjectManagerAfterProjectCreate(Project project, User creator) {
		ProjectMember creatorMember = new ProjectMember();
		creatorMember.setProject(project);
		creatorMember.setUser(creator);
		creatorMember.setRole(ProjectRole.MANAGER);
		creatorMember.setJoinedAt(LocalDateTime.now());
		projectMemberRepository.save(creatorMember);
		project.getMembers().add(creatorMember);

	}

	@Override
	public List<ProjectMemberDto> add(Long projectId, Long adderId, List<ProjectMemberRequest> requests) {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		User adderAsUser = userRepository.findById(adderId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		ProjectMember adderAsManager = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(adderId, projectId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		if (adderAsManager.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Projeye üye eklemeye yetkiniz yok.");
		}

		List<ProjectMemberDto> result = new ArrayList<>();

		for (ProjectMemberRequest request : requests) {
			User user = userRepository.findById(request.getUserId())
					.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

			boolean isUsersConnected = this.connectionRepository.existsConnectionBetweenUsers(adderId,
					request.getUserId());

			if (!isUsersConnected) {
				throw new UnauthorizedActionException("Bağlantınız olmayan kullanıcıyı projeye ekleyemezsiniz.");
			}
		}

		for (ProjectMemberRequest request : requests) {
			User user = userRepository.findById(request.getUserId())
					.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

			if (projectMemberRepository.existsByProjectAndUser(project, user))
				continue;

			ProjectMember member = new ProjectMember();
			member.setProject(project);
			member.setUser(user);
			member.setRole(request.getRole());
			member.setJoinedAt(LocalDateTime.now());
			projectMemberRepository.save(member);

			result.add(projectMemberMapper.toDto(member));
		}

		return result;
	}

	@Override
	public ProjectMemberDto getByUserIdAndProjectId(Long userId, Long projectId) {
		ProjectMember member = this.projectMemberRepository.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));
		return this.projectMemberMapper.toDto(member);
	}

	@Override
	public List<ProjectMemberDto> getMembersByProjectId(Long userId, Long projectId) {
		ProjectMember member = this.projectMemberRepository.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		List<ProjectMember> members = this.projectMemberRepository.getAllByProject_ProjectId(projectId);

		return this.projectMemberMapper.toDtoList(members);
	}

	@Override
	@Transactional
	public List<ProjectMemberDto> deleteMemberFromProject(Long userId, Long deletedUserId, Long projectId) {

		ProjectMember manager = projectMemberRepository.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		if (manager.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Üye silmeye yetkiniz yok.");
		}

		ProjectMember deletedMember = projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(deletedUserId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		if (manager.getUser().getUserId().equals(deletedMember.getUser().getUserId())) {
			throw new BusinessException("Kendinizi silemezsiniz.");
		}

		// 🔥 ÖNCE TASKLARI SİL
		taskRepository.deleteByAssignedMember(deletedMember);
		taskRepository.deleteByCreator(deletedMember);

		// 🔥 SONRA MEMBER’I SİL
		projectMemberRepository.delete(deletedMember);

		return projectMemberMapper.toDtoList(projectMemberRepository.getAllByProject_ProjectId(projectId));
	}

	@Override
	public ProjectMemberDto changeMembersRole(Long userId, Long roleChangedUserId, Long projectId, ProjectRole role) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember member = this.projectMemberRepository.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		ProjectMember roleChangedUser = this.projectMemberRepository
				.findByUser_UserIdAndProject_ProjectId(roleChangedUserId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		if (member.getRole() != ProjectRole.MANAGER) {
			throw new UnauthorizedActionException("Bu işlemi yapmaya yetkiniz yok.");
		}

		if (roleChangedUser.getRole() == role) {
			throw new BusinessException("Kullanıcı zaten bu rolde.");
		}

		if (roleChangedUser.getRole() == ProjectRole.MANAGER) {
			long managerCount = this.projectMemberRepository.countByProject_ProjectIdAndRole(projectId,
					ProjectRole.MANAGER);
			if (roleChangedUser.getUser().getUserId().equals(userId) && managerCount <= 1) {
				throw new BusinessException("Projede en az bir manager olmalı, rolünüzü değiştiremezsiniz.");
			}
		}

		roleChangedUser.setRole(role);
		this.projectMemberRepository.save(roleChangedUser);

		return this.projectMemberMapper.toDto(roleChangedUser);
	}

	@Transactional
	@Override
	public void leaveProject(Long userId, Long projectId) {
		Project project = this.projectRepository.findById(projectId)
				.orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

		ProjectMember member = this.projectMemberRepository.findByUser_UserIdAndProject_ProjectId(userId, projectId)
				.orElseThrow(() -> new NotFoundException("Üye bulunamadı"));

		ProjectRole leavingRole = member.getRole();

		long managerCount = project.getMembers().stream().filter(m -> m.getRole() == ProjectRole.MANAGER).count();

		if (leavingRole == ProjectRole.MANAGER && managerCount <= 1) {
			throw new UnauthorizedActionException("Projede en az 1 adet yönetici (manager) bulunmalıdır.");
		}
		
		this.taskRepository.deleteByAssignedMember(member);

		this.projectMemberRepository.deleteMember(userId, projectId);
	}

	@Override
	public ProjectMemberDto getByMemberIdAndProjectId(Long memberId, Long projectId) {
		ProjectMember member = this.projectMemberRepository.findByMemberIdAndProject_ProjectId(memberId, projectId).orElseThrow(()->new NotFoundException("Üye bulunamadı."));
		return this.projectMemberMapper.toDto(member);
	}

}
