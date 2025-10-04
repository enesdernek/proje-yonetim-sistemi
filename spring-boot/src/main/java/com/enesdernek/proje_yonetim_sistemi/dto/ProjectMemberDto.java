package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDateTime;

import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMemberDto {
	

    private Long memberId;

    private ProjectDto projectDto;

    private UserDto userDto;

    private ProjectRole role = ProjectRole.MEMBER;

    private LocalDateTime joinedAt;

}
