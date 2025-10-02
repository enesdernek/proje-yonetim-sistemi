package com.enesdernek.proje_yonetim_sistemi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionDto {

	private Long connectionId;

	private Long userId;

	private Long connectedUserId;

}
