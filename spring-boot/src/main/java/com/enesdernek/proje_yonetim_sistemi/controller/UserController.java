package com.enesdernek.proje_yonetim_sistemi.controller;

import java.util.List;

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
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessResult;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<SuccessDataResult<UserDto>> register(@RequestBody @Valid UserDtoIU userDtoIU) {
		SuccessDataResult<UserDto> result = new SuccessDataResult<UserDto>(this.userService.register(userDtoIU),
				"Kullanıcı başarıyla oluşturuldu ve doğrulama maili gönderildi.");
		return new ResponseEntity<SuccessDataResult<UserDto>>(result, HttpStatus.CREATED);
	}

	@PostMapping("/authenticate")
	public ResponseEntity<SuccessDataResult<AuthResponse>> authenticate(
			@RequestBody @Valid UserDtoAuthIU userDtoAuthIU) {
		SuccessDataResult<AuthResponse> result = new SuccessDataResult<AuthResponse>(
				this.userService.authenticate(userDtoAuthIU), "Kullanıcı başarıyla giriş yaptı.");
		return new ResponseEntity<SuccessDataResult<AuthResponse>>(result, HttpStatus.OK);
	}

	@GetMapping("/me")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<UserDto>> getAuthenticatedUserByUserId(Authentication authentication) {
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();
		SuccessDataResult<UserDto> result = new SuccessDataResult<UserDto>(
				this.userService.getAuthenticatedUserByUserId(userId), "Giriş yapmış kullanıcı başarıyla getirildi.");
		return new ResponseEntity<SuccessDataResult<UserDto>>(result, HttpStatus.OK);
	}

	@GetMapping("/get-all-paged")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<SuccessDataResult<UserDtoPagedResponse>> getAllUsersPagedByUserIdDesc(
			@RequestParam int pageNo, @RequestParam int pageSize) {
		SuccessDataResult<UserDtoPagedResponse> result = new SuccessDataResult<UserDtoPagedResponse>(
				this.userService.getAllUsersPagedByUserIdDesc(pageNo, pageSize), "Kullanıcılar başarıyla getirildi.");
		return new ResponseEntity<SuccessDataResult<UserDtoPagedResponse>>(result, HttpStatus.OK);
	}

	@PostMapping("/resend-email-verification")
	public ResponseEntity<SuccessResult> resendVerification(@RequestParam String email) {
		this.userService.resendVerification(email);
		SuccessResult result = new SuccessResult("Email doğrulama maili tekrar gönderildi.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

	@PostMapping("/verify-email")
	public ResponseEntity<SuccessResult> verify(@RequestParam String email, @RequestParam int code) {
		userService.verifyEmail(email, code);
		SuccessResult result = new SuccessResult("Email doğrulandı.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

}
