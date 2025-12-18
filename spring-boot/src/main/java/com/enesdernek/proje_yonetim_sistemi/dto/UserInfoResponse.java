package com.enesdernek.proje_yonetim_sistemi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
	
	private long  totalProjectMemberships;
	
	private long  totalTasks;
	
	private long  totalConnections;

}
