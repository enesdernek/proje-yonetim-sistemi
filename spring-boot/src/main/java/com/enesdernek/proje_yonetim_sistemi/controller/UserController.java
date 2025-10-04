package com.enesdernek.proje_yonetim_sistemi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessResult;
import com.enesdernek.proje_yonetim_sistemi.dto.PasswordChangeRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.PasswordResetRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
	
	@DeleteMapping("/delete-profile-image")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<UserDto>> deleteProfileImage(Authentication authentication) {
	    User authUser = (User) authentication.getPrincipal();
	    Long userId = authUser.getUserId();

	    UserDto updatedUser = userService.deleteProfileImageByUserId(userId);

	    SuccessDataResult<UserDto> result = new SuccessDataResult<>(
	            updatedUser,
	            "Profil resmi başarıyla silindi."
	    );
	    return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PostMapping(value = "/upload-profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SuccessDataResult<UserDto>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        User authUser = (User) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        UserDto updatedUser = userService.uploadProfileImageByUserId(userId, file);

        SuccessDataResult<UserDto> result = new SuccessDataResult<>(
                updatedUser,
                "Profil resmi başarıyla güncellendi."
        );
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

	@PostMapping("/send-change-email-adress-email")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessResult> sendChangeEmailAdressEmail(@RequestParam String newEmail,
			@RequestParam String currentPassword, Authentication authentication) {
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		this.userService.sendChangeEmailAdressEmail(userId, newEmail, currentPassword);
		SuccessResult result = new SuccessResult("Email adresi değiştirme emaili başarıyla gönderildi.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

	@PutMapping("/change-email")
	public ResponseEntity<SuccessResult> changeEmail(@RequestParam("token") String token, HttpServletRequest request,
			HttpServletResponse response) {
		this.userService.changeEmail(token, request, response);

		SuccessResult result = new SuccessResult("Email adresi başarıyla değiştirildi ve oturum kapatıldı.");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping("/send-reset-password-email")
	public ResponseEntity<SuccessResult> sendResetPasswordEmail(@RequestParam String email) {
		this.userService.sendResetPasswordEmail(email);
		SuccessResult result = new SuccessResult("Şifre sıfırlama emaili başarıyla gönderildi.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

	@PutMapping("/reset-password")
	public ResponseEntity<SuccessResult> resetPassword(@RequestBody PasswordResetRequest request,
			@RequestParam String token) {
		this.userService.resetPassword(request, token);
		SuccessResult result = new SuccessResult("Şifre başarıyla sıfırlandı.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

	@PutMapping("/change-password")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessResult> changePassword(@RequestBody @Valid PasswordChangeRequest request,
			Authentication authentication) {
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();

		this.userService.changePassword(userId, request);
		SuccessResult result = new SuccessResult("Şifre başarıyla değiştirildi.");

		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
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
	public ResponseEntity<SuccessResult> verify(@RequestParam String token) {
		userService.verifyEmail(token);
		SuccessResult result = new SuccessResult("Email doğrulandı.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}

	@DeleteMapping("/delete-by-user-id")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<SuccessResult> deleteByUserId(@RequestParam Long userId) {
		this.userService.deleteByUserId(userId);
		SuccessResult result = new SuccessResult("Kullanıcı silindi.");
		return new ResponseEntity<SuccessResult>(result, HttpStatus.OK);
	}
}
