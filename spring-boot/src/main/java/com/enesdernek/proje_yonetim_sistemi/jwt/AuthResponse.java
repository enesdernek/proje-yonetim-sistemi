package com.enesdernek.proje_yonetim_sistemi.jwt;


import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private UserDto userDto;
	
	private String token;
	
}