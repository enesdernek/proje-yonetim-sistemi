package com.enesdernek.proje_yonetim_sistemi.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionRequestDtoPagedResponse {
	
	private List<ConnectionRequestDto> requestDtos;

	private Long totalElements;
	
	private int totalPages;
}
