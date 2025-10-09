package com.enesdernek.proje_yonetim_sistemi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;

@RestController
@RequestMapping(path="/api/project-members")
public class ProjectMemberController {
	
	@Autowired
	private ProjectMemberService projectMemberService;
	
	@PostMapping("/add-members")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>> add(@RequestParam Long projectId,@RequestBody  List<ProjectMemberRequest>requests,Authentication authentication){
		
		User user = (User) authentication.getPrincipal();
		Long adderId = user.getUserId();
		
		List<ProjectMemberDto> dtos = this.projectMemberService.add(projectId, adderId, requests);
		SuccessDataResult<List<ProjectMemberDto>> result = new SuccessDataResult<>(dtos,"Kullanıcı veya kullanıcılar başarıyla eklendi.");
		
		return new ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>>(result,HttpStatus.OK);
	}

}
