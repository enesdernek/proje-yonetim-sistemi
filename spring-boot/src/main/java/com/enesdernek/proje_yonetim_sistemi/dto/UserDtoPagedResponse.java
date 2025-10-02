package com.enesdernek.proje_yonetim_sistemi.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDtoPagedResponse {
	
	private List<UserDto> userDtos;
	
	private Long totalElements;

	private int totalPages;
	
}
