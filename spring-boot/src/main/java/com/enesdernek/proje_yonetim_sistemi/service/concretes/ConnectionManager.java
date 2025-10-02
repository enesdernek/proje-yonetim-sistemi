package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.Connection;
import com.enesdernek.proje_yonetim_sistemi.mapper.ConnectionMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ConnectionService;

@Service
public class ConnectionManager implements ConnectionService {

	@Autowired
	private ConnectionRepository connectionRepository;

	@Autowired
	private ConnectionMapper connectionMapper;

	@Autowired
	private UserRepository userRepository;

	@Override
	public ConnectionDtoPagedResponse getAllUsersConnectionsPagedByConnectionIdDesc(Long userId, int pageNo, int pageSize) {
	    Pageable pageable = PageRequest.of(pageNo - 1, pageSize);

	    List<Connection> connections = connectionRepository
	            .findAllByUserOrConnectedUserPagedByConnectionIdDesc(userId, pageable);

	    List<ConnectionDto> connectionDtos = new ArrayList<>();

	    for (Connection con : connections) {
	        ConnectionDto dto = new ConnectionDto();
	        dto.setConnectionId(con.getConnectionId());

	        Long otherUserId;
	        Long authSideUserId;
	        if (con.getUserId().equals(userId)) {
	            authSideUserId = con.getUserId();
	            otherUserId = con.getConnectedUserId();
	        } else {
	            authSideUserId = con.getConnectedUserId();
	            otherUserId = con.getUserId();
	        }

	        userRepository.findById(authSideUserId).ifPresent(authUser -> {
	            dto.setUserId(authUser.getUserId());
	            dto.setUsername(authUser.getUsername());
	            dto.setUsersProfileImageUrl(authUser.getProfileImageUrl());
	        });

	        userRepository.findById(otherUserId).ifPresent(otherUser -> {
	            dto.setConnectedUserId(otherUser.getUserId());
	            dto.setConnectedUsername(otherUser.getUsername());
	            dto.setConnectedUsersProfileImageUrl(otherUser.getProfileImageUrl());
	        });

	        connectionDtos.add(dto);
	    }

	    long totalElements = connectionRepository.countByUserIdOrConnectedUserId(userId, userId);

	    int totalPages = (int) Math.ceil((double) totalElements / pageSize);

	    ConnectionDtoPagedResponse response = new ConnectionDtoPagedResponse();
	    response.setConnectionDtos(connectionDtos);
	    response.setTotalElements(totalElements);
	    response.setTotalPages(totalPages);

	    return response;
	}
	
	 public void deleteConnection(Long authUserId, Long otherUserId) {
	        Connection connection = connectionRepository
	                .findConnectionBetweenUsers(authUserId, otherUserId)
	                .orElseThrow(() -> new RuntimeException("Bağlantı bulunamadı")); 

	        connectionRepository.delete(connection);
	    }


}
