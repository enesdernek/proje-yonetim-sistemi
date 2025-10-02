package com.enesdernek.proje_yonetim_sistemi.service.concretes;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.Role;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.EmailAlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.jwt.JwtService;
import com.enesdernek.proje_yonetim_sistemi.mapper.UserMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.UserService;

@Service
public class UserManager implements UserService {

	private UserRepository userRepository;
	private BCryptPasswordEncoder passwordEncoder;
	private AuthenticationProvider authenticationProvider;
	private JwtService jwtService;
	private UserMapper userMapper;
	private Role role;

	@Autowired
	public UserManager(UserRepository userRepository,
	                   BCryptPasswordEncoder passwordEncoder,
	                   AuthenticationProvider authenticationProvider,
	                   JwtService jwtService,
	                   UserMapper userMapper) {  
	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.authenticationProvider = authenticationProvider;
	    this.jwtService = jwtService;
	    this.userMapper = userMapper;  
	    this.role = Role.USER;  
	}

	@Override
	public UserDto register(UserDtoIU userDtoIU) {

		User user = userMapper.toEntity(userDtoIU);

		if (userRepository.existsByEmail(user.getEmail()) == true) {
			throw new EmailAlreadyExistsException("Bu email ile zaten bir hesap oluşturulmuş");
		}

		user.setPassword(passwordEncoder.encode(userDtoIU.getPassword()));

		user.setRole(role.USER);

		User savedUser = userRepository.save(user);

		return userMapper.toDto(savedUser);

	}
	
    @Override
	public AuthResponse authenticate(UserDtoAuthIU userDtoAuthIU) {

		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDtoAuthIU.getEmail(),
				userDtoAuthIU.getPassword());

		authenticationProvider.authenticate(auth);

		User user = userRepository.findByEmail(userDtoAuthIU.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı."));

		UserDto userDto = userMapper.toDto(user);
		String token = jwtService.generateToken(user);

		return new AuthResponse(userDto, token);

	}

	@Override
	public UserDto getAuthenticatedUserByUserId(Long userId) {
		User user = this.userRepository.findById(userId).orElseThrow(()->new UsernameNotFoundException("Kullanıcı bulunamadı."));
		UserDto userDto = userMapper.toDto(user);
		return userDto;
	}

	@Override
	public UserDtoPagedResponse getAllUsersPagedByUserIdDesc(int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo-1, pageSize);
		List<User> users = this.userRepository.getAllUsersPagedByUserIdDesc(pageable);
		Long totalElements = this.userRepository.count();
	    int totalPages = (int) Math.ceil((double) totalElements / pageSize);
		List<UserDto> userDtos = this.userMapper.toDtoList(users);
		UserDtoPagedResponse response = new UserDtoPagedResponse();
		response.setTotalPages(totalPages);
		response.setTotalElements(totalElements);
		response.setUserDtos(userDtos);
		return response;
	}

}
