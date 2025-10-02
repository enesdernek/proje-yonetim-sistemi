package com.enesdernek.proje_yonetim_sistemi.service.abstracts;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoPagedResponse;

public interface ConnectionRequestService {
	
	public ConnectionRequestDto create(Long userId,ConnectionRequestDtoIU connectionRequestDtoIU);
	
	public ConnectionRequestDtoPagedResponse getAllUsersSendedConnectionRequestsPaged(Long userId,int pageNo,int pageSize);
	
	public ConnectionRequestDtoPagedResponse getAllUsersReceivedConnectionRequestsPaged(Long userId,int pageNo,int pageSize);

}
