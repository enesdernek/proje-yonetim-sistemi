package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import java.util.List;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

public interface ProjectMemberService {

	public List<ProjectMemberDto> add(Long projectId, Long adderId, List<ProjectMemberRequest> requests);

	public void addCreatorAsProjectManagerAfterProjectCreate(Project project, User creator);
	
	public ProjectMemberDto getByUserIdAndProjectId(Long userId,Long projectId);
	
	List<ProjectMemberDto> getMembersByProjectId(Long userId, Long projectId);
	
	public List<ProjectMemberDto> deleteMemberFromProject(Long userId,Long deletedUserId,Long projectId);
	
	public ProjectMemberDto changeMembersRole(Long userId, Long roleChangedUserId, Long projectId, ProjectRole role);

}
