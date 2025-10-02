package com.enesdernek.proje_yonetim_sistemi.dto;

import java.time.LocalDateTime;

import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionRequestDto {
	
	private Long requestId;
    private Long senderId;
    private String sendersUsername;
    private String sendersProfileImageUrl;
    private Long receiverId;
    private String recieversUsername;
    private String recieversProfileImageUrl;
    private ConnectionRequestStatus status = ConnectionRequestStatus.PENDING;
    private LocalDateTime createdAt;

}
