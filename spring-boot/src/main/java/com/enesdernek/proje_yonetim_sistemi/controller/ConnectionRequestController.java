package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ConnectionRequestService;

@RestController
@RequestMapping("/api/connection-requests")
public class ConnectionRequestController {

	@Autowired
	private ConnectionRequestService connectionRequestService;

	@PostMapping("/create")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ConnectionRequestDto>> create(
			@RequestBody ConnectionRequestDtoIU connectionRequestDtoIU, Authentication authentication) {

		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		SuccessDataResult<ConnectionRequestDto> request = new SuccessDataResult<ConnectionRequestDto>(
				this.connectionRequestService.create(userId, connectionRequestDtoIU), "Bağlantı isteği gönderildi.");
		return new ResponseEntity<SuccessDataResult<ConnectionRequestDto>>(request, HttpStatus.CREATED);
	}
	
	@GetMapping("/get-all-users-received-connection-requests-paged")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ConnectionRequestDtoPagedResponse>> getAllUsersReceivedConnectionRequestsPaged( int pageNo,
			int pageSize,Authentication authentication) {
		User user = (User)authentication.getPrincipal();
		Long userId = user.getUserId();
		
		SuccessDataResult<ConnectionRequestDtoPagedResponse> result = new SuccessDataResult<ConnectionRequestDtoPagedResponse>(
				this.connectionRequestService.getAllUsersReceivedConnectionRequestsPaged(userId, pageNo, pageSize),
				"Kullanıcıya gelen bağlantı istekleri başarıyla getirildi.");
		
		return new ResponseEntity<SuccessDataResult<ConnectionRequestDtoPagedResponse>>(result,HttpStatus.OK);
	}

	@GetMapping("/get-all-users-sended-connection-requests-paged")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<ConnectionRequestDtoPagedResponse>> getAllUsersSendedConnectionRequestsPaged(
			@RequestParam int pageNo, @RequestParam int pageSize, Authentication authentication) {
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		SuccessDataResult<ConnectionRequestDtoPagedResponse> result = new SuccessDataResult<ConnectionRequestDtoPagedResponse>(
				this.connectionRequestService.getAllUsersSendedConnectionRequestsPaged(userId, pageNo, pageSize),
				"Kullanıcının yolladığı bağlantı istekleri başarıyla getirildi.");
		
		return new ResponseEntity<SuccessDataResult<ConnectionRequestDtoPagedResponse>>(result,HttpStatus.OK);
	}

}
