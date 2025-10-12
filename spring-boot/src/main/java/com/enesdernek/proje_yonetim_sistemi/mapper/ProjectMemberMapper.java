package com.enesdernek.proje_yonetim_sistemi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProjectMapper.class})
public interface ProjectMemberMapper {

	@Mapping(source = "project", target = "projectDto")
    @Mapping(source = "user", target = "userDto")
    ProjectMemberDto toDto(ProjectMember projectMember);

    @Mapping(source = "projectDto", target = "project")
    @Mapping(source = "userDto", target = "user")
    ProjectMember toEntity(ProjectMemberDto projectMemberDto);

    List<ProjectMemberDto> toDtoList(List<ProjectMember> projectMembers);

    List<ProjectMember> toEntityList(List<ProjectMemberDto> projectMemberDtos);
}