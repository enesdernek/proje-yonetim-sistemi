package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.Connection;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequestStatus;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyConnectedException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidConnectionException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;
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
	public ConnectionRequestDto create(Long userId, ConnectionRequestDtoIU connectionRequestDtoIU) {

		User sender = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));
		User receiver = this.userRepository.findById(connectionRequestDtoIU.getReceiverId())
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		if (sender.getUserId() == receiver.getUserId()) {
			throw new InvalidConnectionException("Kullanıcı kendisine bağlantı isteği gönderemez.");
		}

		boolean isAlreadyConnected = this.connectionRepository.existsByUserIdAndConnectedUserId(userId,
				connectionRequestDtoIU.getReceiverId());

		if (isAlreadyConnected) {
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

		ConnectionRequestDto requestDto = this.connectionRequestMapper.toDto(savedRequest);
		requestDto.setSenderId(userId);
		requestDto.setSendersUsername(sender.getUsername());
		requestDto.setSendersProfileImageUrl(sender.getProfileImageUrl());
		requestDto.setReceiverId(receiver.getUserId());
		requestDto.setRecieversUsername(receiver.getUsername());
		requestDto.setRecieversProfileImageUrl(receiver.getProfileImageUrl());
		return requestDto;

	}

	public ConnectionRequestDtoPagedResponse getAllUsersSendedConnectionRequestsPaged(Long userId, int pageNo,
			int pageSize) {
		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
		List<ConnectionRequest> requests = this.connectionRequestRepository
				.getAllUsersSendedConnectionRequestsPagedByRequestIdDesc(userId, pageable);

		User sender = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Bağlantı isteği alan kullanıcı bulunamadı."));

		List<ConnectionRequestDto> dtoList = new ArrayList<>();
		for (ConnectionRequest req : requests) {
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
		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
		List<ConnectionRequest> requests = this.connectionRequestRepository
				.getAllUsersReceivedConnectionRequestsPagedByRequestIdDesc(userId, pageable);

		User receiver = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Bağlantı isteği alan kullanıcı bulunamadı."));

		List<ConnectionRequestDto> dtoList = new ArrayList<>();

		for (ConnectionRequest req : requests) {
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

	@Override
	public ConnectionRequestDto acceptRequest(Long userId, Long requestId) {

		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));
		ConnectionRequest request = this.connectionRequestRepository.findById(requestId)
				.orElseThrow(() -> new NotFoundException("Bağlantı isteği bulunamadı."));

		if (request.getStatus() == ConnectionRequestStatus.REJECTED) {
			throw new UnauthorizedActionException("Bu istek önceden reddedilmiş.");
		}

		if (request.getStatus() == ConnectionRequestStatus.APPROVED) {
			throw new UnauthorizedActionException("Bu istek önceden kabul edilmiş.");
		}

		boolean isAlreadyConnected = this.connectionRepository.existsByUserIdAndConnectedUserId(request.getSenderId(),
				userId);

		boolean isConnectedAlready = this.connectionRepository.existsByUserIdAndConnectedUserId(userId,
				request.getSenderId());

		if (isAlreadyConnected || isConnectedAlready) {
			throw new AlreadyConnectedException("Zaten bu kullanıcı ile bağlantı kurulmuş");
		}

		if (!request.getReceiverId().equals(userId)) {
			throw new UnauthorizedActionException("Bu isteği kabul etmeye yetkiniz yok.");
		}

		request.setStatus(ConnectionRequestStatus.APPROVED);
		this.connectionRequestRepository.save(request);

		Connection connection = new Connection();
		connection.setUserId(userId);
		connection.setConnectedUserId(request.getSenderId());
		this.connectionRepository.save(connection);

		return this.connectionRequestMapper.toDto(request);
	}

	@Override
	public ConnectionRequestDto rejectRequest(Long userId, Long requestId) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));
		ConnectionRequest request = this.connectionRequestRepository.findById(requestId)
				.orElseThrow(() -> new NotFoundException("Bağlantı isteği bulunamadı."));

		if (request.getStatus() == ConnectionRequestStatus.APPROVED) {
			throw new UnauthorizedActionException("Bu istek önceden kabul edilmiş.");
		}

		if (request.getStatus() == ConnectionRequestStatus.REJECTED) {
			throw new UnauthorizedActionException("Bu istek önceden reddedilmiş.");
		}

		boolean isAlreadyConnected = this.connectionRepository.existsByUserIdAndConnectedUserId(request.getSenderId(),
				userId);

		boolean isConnectedAlready = this.connectionRepository.existsByUserIdAndConnectedUserId(userId,
				request.getSenderId());

		if (isAlreadyConnected || isConnectedAlready) {
			throw new AlreadyConnectedException("Zaten bu kullanıcı ile bağlantı kurulmuş");
		}

		if (!request.getReceiverId().equals(userId)) {
			throw new UnauthorizedActionException("Bu isteği reddetmeye yetkiniz yok.");
		}

		request.setStatus(ConnectionRequestStatus.REJECTED);
		this.connectionRequestRepository.save(request);

		return this.connectionRequestMapper.toDto(request);
	}

	@Override
	public void deleteRequest(Long userId, Long requestId) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));
		ConnectionRequest request = this.connectionRequestRepository.findById(requestId)
				.orElseThrow(() -> new NotFoundException("İstek bulunamadı."));

		if (request.getSenderId() != userId) {
			throw new UnauthorizedActionException("İsteği giriş yapmış kullanıcı atmamış.");
		}

		if (request.getStatus() == ConnectionRequestStatus.APPROVED) {
			throw new UnauthorizedActionException("İstek önceden kabul edilmiş.");
		}

		if (request.getStatus() == ConnectionRequestStatus.REJECTED) {
			throw new UnauthorizedActionException("İstek önceden reddedilmiş.");
		}

		this.connectionRequestRepository.delete(request);

	}

}
