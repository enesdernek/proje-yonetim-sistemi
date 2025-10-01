package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(path="/api/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<SuccessDataResult<UserDto>> register(@RequestBody @Valid UserDtoIU userDtoIU){
		SuccessDataResult<UserDto> result = new SuccessDataResult<UserDto>(this.userService.register(userDtoIU), "Kullanıcı başarıyla oluşturuldu.");
		return new ResponseEntity<SuccessDataResult<UserDto>>(result,HttpStatus.CREATED);
	}
	
	@PostMapping("/authenticate")
	public ResponseEntity<SuccessDataResult<AuthResponse>> authenticate(@RequestBody @Valid UserDtoAuthIU userDtoAuthIU){
		SuccessDataResult<AuthResponse> result = new SuccessDataResult<AuthResponse>(this.userService.authenticate(userDtoAuthIU), "Kullanıcı başarıyla giriş yaptı.");
		return new ResponseEntity<SuccessDataResult<AuthResponse>>(result,HttpStatus.OK);
	}

}
