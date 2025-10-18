package com.enesdernek.proje_yonetim_sistemi.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.Project;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProjectMemberMapper.class, TaskMapper.class})
public interface ProjectMapper {
	
	ProjectDto toDto(Project project);
	
	Project toEntity(ProjectDtoIU projectDtoIU);
	
	List<ProjectDto> toDtoList(List<Project>projects);
	
	List<Project> toEntityList(List<ProjectDto>projectDtos);

}
