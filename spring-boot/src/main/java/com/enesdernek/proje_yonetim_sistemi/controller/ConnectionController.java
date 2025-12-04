package com.enesdernek.proje_yonetim_sistemi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessDataResult;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.SuccessResult;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ConnectionService;

@RestController
@RequestMapping(path = "/api/connections")
public class ConnectionController {

	@Autowired
	private ConnectionService connectionService;
	
	@GetMapping("/is-connected")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessDataResult<Boolean>> isConnected(
	        @RequestParam Long otherUserId,
	        Authentication authentication
	) {
	    User user = (User) authentication.getPrincipal();
	    Long userId = user.getUserId();

	    boolean isConnected = connectionService.isConnected(userId, otherUserId);

	    SuccessDataResult<Boolean> result =
	            new SuccessDataResult<>(isConnected, "Bağlantı durumu getirildi.");

	    return ResponseEntity.ok(result);
	}

	@GetMapping("/get-connections-paged")
	public ResponseEntity<SuccessDataResult<ConnectionDtoPagedResponse>> getAllUsersConnectionsPagedByConnectionIdDesc(
			Long userId, @RequestParam int pageNo, @RequestParam int pageSize) {
		SuccessDataResult<ConnectionDtoPagedResponse> result = new SuccessDataResult<ConnectionDtoPagedResponse>(
				this.connectionService.getAllUsersConnectionsPagedByConnectionIdDesc(userId, pageNo, pageSize),
				"Kullanıcının bağlantıları başarıyla getirildi.");

		return new ResponseEntity<SuccessDataResult<ConnectionDtoPagedResponse>>(result, HttpStatus.OK);
	}

	@DeleteMapping("/delete")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SuccessResult> deleteConnection( @RequestParam Long otherUserId,Authentication authentication) {
		
		User user = (User) authentication.getPrincipal();
		Long userId = user.getUserId();
		
		this.connectionService.deleteConnection(userId, otherUserId);
		SuccessResult result = new SuccessResult("Bağlantı başarıyla silindi.");
		
		return new ResponseEntity<SuccessResult>(result,HttpStatus.OK);
		
	}

}
