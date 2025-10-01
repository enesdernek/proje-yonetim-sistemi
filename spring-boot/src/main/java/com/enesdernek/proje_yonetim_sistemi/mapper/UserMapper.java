package com.enesdernek.proje_yonetim_sistemi.mapper;

import org.mapstruct.Mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	UserDto toDto(User user);
	
	User toEntity(UserDtoIU userDtoIU);

}
