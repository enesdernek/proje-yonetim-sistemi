package com.enesdernek.proje_yonetim_sistemi.service.abstracts;


import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ChangePhoneRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.PasswordChangeRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.PasswordResetRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.dto.UserInfoResponse;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public interface UserService {
	
    public UserDto register(UserDtoIU userDtoIU);

	public AuthResponse authenticate(UserDtoAuthIU userDtoAuthIU);
	
	public UserDto getAuthenticatedUserByUserId(Long userId);
	
	public UserDtoPagedResponse getAllUsersPagedByUserIdDesc(int pageNo, int pageSize);
	
	public void deleteByUserId(Long userId);
	
	
	public void resendVerification(String email);
	
	public void verifyEmail(String token);
	
	public void changePassword(Long userId, PasswordChangeRequest request);
	
	public void sendResetPasswordEmail(String email);

	public void resetPassword(PasswordResetRequest request, String token);
	
	public void sendChangeEmailAdressEmail(Long userId,String newEmail, String currentPassword);
	
	public void changeEmail(String token, HttpServletRequest request, HttpServletResponse response);
	
	public UserDto uploadProfileImageByUserId(Long userId, MultipartFile file);
	
	public UserDto deleteProfileImageByUserId(Long userId);
	
	public UserDto changePhone(Long userId,ChangePhoneRequest request);
	
	public UserDtoPagedResponse searchUsersUsernameContains(String searchInput);
	
	public UserDto getUserByUserId(Long userId);
	
	public UserInfoResponse getUserInfos(Long userId);
	

}
