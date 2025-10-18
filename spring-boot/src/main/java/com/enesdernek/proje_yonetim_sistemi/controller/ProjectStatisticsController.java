package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectStatisticsDto;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectStatisticsService;

@RestController
@RequestMapping(path = "/api/project-statistics")
public class ProjectStatisticsController {

	@Autowired
	private ProjectStatisticsService projectStatisticsService;

	@GetMapping("get-by-project-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectStatisticsDto>> getStatisticsByProject_ProjectId(
			Authentication authentication, Long projectId) {

		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		SuccessDataResult<ProjectStatisticsDto> result = new SuccessDataResult<ProjectStatisticsDto>(
				this.projectStatisticsService.getStatisticsByProject_ProjectId(userId, projectId),
				"Proje istatistikleri başarıyla getirildi.");
		
		return new ResponseEntity<>(result,HttpStatus.OK);

	}

}
