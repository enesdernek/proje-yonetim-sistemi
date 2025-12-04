package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDtoPagedResponse;

public interface ConnectionService {
	
	public ConnectionDtoPagedResponse getAllUsersConnectionsPagedByConnectionIdDesc(Long userId,int pageNo,int pageSize);
	
	public void deleteConnection(Long authUserId, Long otherUserId);
	
	boolean isConnected(Long userId, Long otherUserId);


}
