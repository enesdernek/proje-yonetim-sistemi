package com.enesdernek.proje_yonetim_sistemi.dto;

import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMemberRequest {
    private Long userId;
    private ProjectRole role;
}