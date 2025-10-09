package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import java.util.List;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

public interface ProjectMemberService {

	public List<ProjectMemberDto> add(Long projectId, Long adderId, List<ProjectMemberRequest> requests);

	public void addCreatorAsProjectManagerAfterProjectCreate(Project project, User creator);
}
