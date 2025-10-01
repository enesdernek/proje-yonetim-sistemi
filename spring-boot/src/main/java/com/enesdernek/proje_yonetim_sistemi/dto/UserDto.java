package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDateTime;

import com.enesdernek.proje_yonetim_sistemi.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

	private Long userId;

	private Role role;

	private String username;

	private String email;

	private String phone;

	private String profileImageUrl;

	private LocalDateTime createdAt;

	private boolean emailVerified = false;

}
