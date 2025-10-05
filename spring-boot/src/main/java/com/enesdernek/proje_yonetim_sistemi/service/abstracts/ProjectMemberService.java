package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import java.util.List;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

public interface ProjectMemberService {

	public List<ProjectMemberDto> add(Long projectId, List<Long> userIds);

	public void addMembersAfterProjectCreate(Project project, User creator,  List<ProjectMemberRequest> members);
}
