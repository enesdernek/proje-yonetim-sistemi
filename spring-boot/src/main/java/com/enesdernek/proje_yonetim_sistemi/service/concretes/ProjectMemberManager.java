package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectMemberMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;

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

		User adderAsUser = userRepository.findById(adderId).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));
		
		ProjectMember adderAsManager = this.projectMemberRepository.findByUser_UserIdAndProject_ProjectId(adderId,projectId).orElseThrow(()->new NotFoundException("Kullanıcı bulunamadı."));
		
		if(adderAsManager.getRole() != ProjectRole.MANAGER) {
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

}
