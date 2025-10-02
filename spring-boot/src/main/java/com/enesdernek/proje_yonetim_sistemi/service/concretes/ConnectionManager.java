package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.enesdernek.proje_yonetim_sistemi.mapper.ConnectionMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.ConnectionService;

@Service
public class ConnectionManager implements ConnectionService{
	
	@Autowired
	private ConnectionRepository connectionRepository;
	
	@Autowired
	private ConnectionMapper connectionMapper;
	
	@Autowired
	private UserRepository userRepository;

	

}
