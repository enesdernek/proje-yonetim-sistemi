package com.enesdernek.proje_yonetim_sistemi.service.concretes;


import java.util.ArrayList;
import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequestStatus;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyConnectedException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.mapper.ConnectionRequestMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRequestRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ConnectionRequestService;

@Service
public class ConnectionRequestManager implements ConnectionRequestService {

	@Autowired
	private ConnectionRequestRepository connectionRequestRepository;

	@Autowired
	private ConnectionRequestMapper connectionRequestMapper;
	
	@Autowired
	private ConnectionRepository connectionRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public ConnectionRequestDto create(Long userId,ConnectionRequestDtoIU connectionRequestDtoIU) {
		
		User sender = this.userRepository.findById(userId).orElseThrow(()->new NotFoundException("Kullanıcı bulunamadı."));
		User reciever = this.userRepository.findById(connectionRequestDtoIU.getReceiverId()).orElseThrow(()->new NotFoundException("Kullanıcı bulunamadı."));

		boolean isAlreadyConnected = this.connectionRepository.existsByUserIdAndConnectedUserId(userId, connectionRequestDtoIU.getReceiverId());
		
		if(isAlreadyConnected) {
			throw new AlreadyConnectedException("Zaten bu kullanıcı ile bağlantı kurulmuş");
		}

		boolean exists = connectionRequestRepository.existsBySenderIdAndReceiverIdAndStatus(userId,
				connectionRequestDtoIU.getReceiverId(), ConnectionRequestStatus.PENDING);

		if (exists) {
			throw new AlreadyExistsException("Bu kullanıcıya zaten bekleyen bir bağlantı isteği gönderilmiş.");
		}

		ConnectionRequest connectionRequest = this.connectionRequestMapper.toEntity(connectionRequestDtoIU);
		connectionRequest.setSenderId(userId);
		ConnectionRequest savedRequest = this.connectionRequestRepository.save(connectionRequest);
		return this.connectionRequestMapper.toDto(savedRequest);

	}
	
	public ConnectionRequestDtoPagedResponse getAllUsersSendedConnectionRequestsPaged(Long userId,int pageNo,int pageSize) {
		Pageable pageable = PageRequest.of(pageNo-1, pageSize);
		List<ConnectionRequest> requests = this.connectionRequestRepository.getAllUsersSendedConnectionRequestsPagedByRequestIdDesc(userId, pageable);
		
	    User sender = this.userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Bağlantı isteği alan kullanıcı bulunamadı."));
		
		List<ConnectionRequestDto> dtoList = new ArrayList<>();
		for(ConnectionRequest req : requests) {
		    User receiver = this.userRepository.findById(req.getReceiverId())
		                      .orElseThrow(() -> new NotFoundException("Bağlantı isteği atılan kullanıcı bulunamadı."));
		    ConnectionRequestDto dto = connectionRequestMapper.toDto(req);
		    dto.setSenderId(userId);
		    dto.setSendersProfileImageUrl(sender.getProfileImageUrl());
		    dto.setSendersUsername(sender.getUsername());
		    dto.setRecieversUsername(receiver.getUsername());
		    dto.setRecieversProfileImageUrl(receiver.getProfileImageUrl());
		    dtoList.add(dto);
		}
		ConnectionRequestDtoPagedResponse response = new ConnectionRequestDtoPagedResponse();
		Long totalElements = this.connectionRequestRepository.count();
	    int totalPages = (int) Math.ceil((double) totalElements / pageSize);
		response.setTotalElements(totalElements);
		response.setTotalPages(totalPages);
		response.setRequestDtos(dtoList);
		return response;
		
	}

	@Override
	public ConnectionRequestDtoPagedResponse getAllUsersReceivedConnectionRequestsPaged(Long userId, int pageNo,
			int pageSize) {
		Pageable pageable = PageRequest.of(pageNo-1, pageSize);
		List<ConnectionRequest> requests = this.connectionRequestRepository.getAllUsersReceivedConnectionRequestsPagedByRequestIdDesc(userId, pageable);
		
	    User receiver = this.userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Bağlantı isteği alan kullanıcı bulunamadı."));

		
		List<ConnectionRequestDto> dtoList = new ArrayList<>();
		
		for(ConnectionRequest req : requests) {
		    User sender = userRepository.findById(req.getSenderId())
		                      .orElseThrow(() -> new NotFoundException("Bağlantı isteği atan kullanıcı bulunamadı."));
		    ConnectionRequestDto dto = connectionRequestMapper.toDto(req);
		    dto.setReceiverId(receiver.getUserId());
		    dto.setRecieversUsername(receiver.getUsername());
		    dto.setRecieversProfileImageUrl(receiver.getProfileImageUrl());
		    dto.setSenderId(sender.getUserId());
		    dto.setSendersProfileImageUrl(sender.getProfileImageUrl());
		    dto.setSendersUsername(sender.getUsername());

		    dtoList.add(dto);
		}
		
		ConnectionRequestDtoPagedResponse response = new ConnectionRequestDtoPagedResponse();
		Long totalElements = this.connectionRequestRepository.count();
	    int totalPages = (int) Math.ceil((double) totalElements / pageSize);
		response.setTotalElements(totalElements);
		response.setTotalPages(totalPages);
		response.setRequestDtos(dtoList);
		return response;
	}

}
