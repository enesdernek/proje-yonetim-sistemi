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
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectMemberMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;

@Service
public class ProjectMemberManager implements ProjectMemberService{
	
	 @Autowired
	    private ProjectMemberRepository projectMemberRepository;

	    @Autowired
	    private UserRepository userRepository;
	    
	    @Autowired
	    private ProjectRepository projectRepository;
	    
	    @Autowired
	    private ProjectMemberMapper projectMemberMapper;

	    @Override
	    public void addMembersAfterProjectCreate(Project project, User creator,   List<ProjectMemberRequest> members) {
	        ProjectMember creatorMember = new ProjectMember();
	        creatorMember.setProject(project);
	        creatorMember.setUser(creator);
	        creatorMember.setRole(ProjectRole.MANAGER);
	        creatorMember.setJoinedAt(LocalDateTime.now());
	        projectMemberRepository.save(creatorMember);
	        project.getMembers().add(creatorMember);

	        if (members != null && !members.isEmpty()) {
	            for (ProjectMemberRequest memberRequest : members) {
	                User user = userRepository.findById(memberRequest.getUserId())
	                        .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı: " + memberRequest.getUserId()));

	                ProjectMember projectMember = new ProjectMember();
	                projectMember.setProject(project);
	                projectMember.setUser(user);
	                projectMember.setRole(memberRequest.getRole() != null ? memberRequest.getRole() : ProjectRole.MEMBER);
	                projectMember.setJoinedAt(LocalDateTime.now());
	                projectMemberRepository.save(projectMember);
	                project.getMembers().add(projectMember);
	            }
	        }
	    
	    }

	    @Override
	    public List<ProjectMemberDto> add(Long projectId, List<Long> userIds) {
	        Project project = projectRepository.findById(projectId)
	                .orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

	        List<ProjectMemberDto> result = new ArrayList<>();

	        for (Long userId : userIds) {
	            User user = userRepository.findById(userId)
	                    .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı: " + userId));

	            if (projectMemberRepository.existsByProjectAndUser(project, user)) continue;

	            ProjectMember member = new ProjectMember();
	            member.setProject(project);
	            member.setUser(user);
	            member.setRole(ProjectRole.MEMBER);
	            member.setJoinedAt(LocalDateTime.now());
	            projectMemberRepository.save(member);

	            result.add(projectMemberMapper.toDto(member));
	        }

	        return result;
	    }

}
