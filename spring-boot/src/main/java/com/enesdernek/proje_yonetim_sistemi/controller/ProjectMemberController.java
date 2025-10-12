package com.enesdernek.proje_yonetim_sistemi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ProjectMemberRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ProjectMemberService;

@RestController
@RequestMapping(path="/api/project-members")
public class ProjectMemberController {
	
	@Autowired
	private ProjectMemberService projectMemberService;
	
	@PutMapping("/change-members-role")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectMemberDto>> changeMembersRole(Authentication auth,@RequestParam Long roleChangedUserId,@RequestParam Long projectId,@RequestParam ProjectRole role) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();
		
		ProjectMemberDto dto = this.projectMemberService.changeMembersRole(userId, roleChangedUserId, projectId, role);
		SuccessDataResult<ProjectMemberDto> result = new SuccessDataResult<>(dto,"Üyenin rolü başarıyla değiştirildi.");
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@DeleteMapping("/delete-member-by-user-id-and-project-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>> deleteMemberFromProject(Authentication auth, @RequestParam Long deletedUserId,@RequestParam Long projectId){
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();
		
		List<ProjectMemberDto> dtos = this.projectMemberService.deleteMemberFromProject(userId, deletedUserId, projectId);
		SuccessDataResult<List<ProjectMemberDto>> result = new SuccessDataResult<>(dtos,"Üye başarıyla silindi.");
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/get-members")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>> getMembersByProjectId(Authentication auth,@RequestParam Long projectId) {
		User user = (User) auth.getPrincipal();
		Long userId = user.getUserId();
		
		List<ProjectMemberDto> dtos = this.projectMemberService.getMembersByProjectId(userId, projectId);
		SuccessDataResult<List<ProjectMemberDto>> result = new SuccessDataResult<>(dtos,"Üyeler başarıyla getirildi.");
		
		return new ResponseEntity<>(result,HttpStatus.OK);


	}
	
	@GetMapping("get-by-user-id-and-project-id")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ProjectMemberDto>> getByUserIdAndProjectId(@RequestParam Long userId,@RequestParam Long projectId) {
		
		ProjectMemberDto dto = this.projectMemberService.getByUserIdAndProjectId(userId, projectId);
		SuccessDataResult<ProjectMemberDto> result = new SuccessDataResult<>(dto,"Kullanıcı başarıyla getirildi");
		
		return new ResponseEntity<>(result,HttpStatus.OK);

	}
	
	@PostMapping("/add-members")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>> add(@RequestParam Long projectId,@RequestBody  List<ProjectMemberRequest>requests,Authentication authentication){
		
		User user = (User) authentication.getPrincipal();
		Long adderId = user.getUserId();
		
		List<ProjectMemberDto> dtos = this.projectMemberService.add(projectId, adderId, requests);
		SuccessDataResult<List<ProjectMemberDto>> result = new SuccessDataResult<>(dtos,"Üye veya üyeler başarıyla eklendi.");
		
		return new ResponseEntity<SuccessDataResult<List<ProjectMemberDto>>>(result,HttpStatus.OK);
	}

}
