package com.enesdernek.proje_yonetim_sistemi.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProjectMapper.class})
public interface ProjectMemberMapper {

    ProjectMemberDto toDto(ProjectMember projectMember);

    ProjectMember toEntity(ProjectMemberDto projectMemberDto);

    List<ProjectMemberDto> toDtoList(List<ProjectMember> projectMembers);

    List<ProjectMember> toEntityList(List<ProjectMemberDto> projectMemberDtos);
}