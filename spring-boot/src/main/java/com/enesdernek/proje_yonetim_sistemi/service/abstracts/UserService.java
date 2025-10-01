package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;


public interface UserService {
	
    public UserDto register(UserDtoIU userDtoIU);

	public AuthResponse authenticate(UserDtoAuthIU userDtoAuthIU);
	


}
