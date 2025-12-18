package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectStatisticsDto;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.TaskStatus;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ProjectMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectMemberRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ProjectRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectStatisticsService;

@Service
public class ProjectStatisticsManager implements ProjectStatisticsService {

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ProjectMemberRepository projectMemberRepository;
	
	@Autowired
	private ProjectMapper projectMapper;

	@Override
    public ProjectStatisticsDto getStatisticsByProject_ProjectId(Long authUserId, Long projectId) {

        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Proje bulunamadı."));

        ProjectMember member = this.projectMemberRepository
                .findByUser_UserIdAndProject_ProjectId(authUserId, projectId)
                .orElseThrow(() -> new NotFoundException("Üye bulunamadı."));

        if (member.getRole() != ProjectRole.MANAGER) {
            throw new UnauthorizedActionException("Bu işlemi yapmaya yetkiniz yok.");
        }

        int totalTasks = project.getTasks().size();
        int completedTasks = (int) project.getTasks().stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        int pendingTasks = totalTasks - completedTasks;

        int totalMembers = project.getMembers().size();

        ProjectDto projectDto = projectMapper != null ? projectMapper.toDto(project) : null;

        ProjectStatisticsDto dto = new ProjectStatisticsDto();
        dto.setCompletionRate(projectDto.getProgress());
        dto.setStatsId(project.getProjectId()); 
        dto.setProjectDto(projectDto);
        dto.setTotalTasks(totalTasks);
        dto.setCompletedTasks(completedTasks);
        dto.setPendingTasks(pendingTasks);
        dto.setTotalMembers(totalMembers);

        return dto;
    }

}
