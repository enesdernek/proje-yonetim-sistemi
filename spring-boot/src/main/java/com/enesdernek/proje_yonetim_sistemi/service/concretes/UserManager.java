package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
import com.enesdernek.proje_yonetim_sistemi.entity.EmailVerificationToken;
import com.enesdernek.proje_yonetim_sistemi.entity.Role;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyValidException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidCodeException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.TokenExpiredException;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.jwt.JwtService;
import com.enesdernek.proje_yonetim_sistemi.mapper.UserMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.EmailVerificationTokenRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.UserRepository;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.EmailService;
import com.enesdernek.proje_yonetim_sistemi.service.abstracts.UserService;

import jakarta.transaction.Transactional;

@Service
public class UserManager implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationProvider authenticationProvider;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private EmailVerificationTokenRepository emailVerificationTokenRepository;

	@Autowired
	private EmailService emailService;

	@Override
	@Transactional
	public UserDto register(UserDtoIU userDtoIU) {

		Optional<User> existingUserOpt = userRepository.findByEmail(userDtoIU.getEmail());
		
		boolean isExistsByUsername = this.userRepository.existsByUsername(userDtoIU.getUsername());
		
		if(isExistsByUsername) {
			throw new AlreadyExistsException("Bu kullanıcı adına sahip bir kullanıcı zaten var.");
		}

		if (existingUserOpt.isPresent()) {
			User existingUser = existingUserOpt.get();

			if (existingUser.isEnabled()) {
				throw new AlreadyExistsException("Bu email ile zaten aktif bir hesap var");
			} else {
				emailVerificationTokenRepository.deleteByUser(existingUser);

				int verificationCode = (int) (Math.random() * 900000) + 100000;

				EmailVerificationToken token = new EmailVerificationToken();
				token.setUser(existingUser);
				token.setCode(verificationCode);
				token.setExpiryDate(LocalDateTime.now().plusHours(1));

				this.emailVerificationTokenRepository.save(token);

				emailService.sendRegisterVerificationCode(existingUser.getEmail(), verificationCode);

				return userMapper.toDto(existingUser);
			}
		}
		
		User user = userMapper.toEntity(userDtoIU);
		user.setPassword(passwordEncoder.encode(userDtoIU.getPassword()));
		user.setRole(Role.USER);
		user.setEnabled(false);

		User savedUser = userRepository.save(user);

		int verificationCode = (int) (Math.random() * 900000) + 100000;

		EmailVerificationToken token = new EmailVerificationToken();
		token.setUser(savedUser);
		token.setCode(verificationCode);
		token.setExpiryDate(LocalDateTime.now().plusHours(1));

		this.emailVerificationTokenRepository.save(token);

		emailService.sendRegisterVerificationCode(savedUser.getEmail(), verificationCode);

		return userMapper.toDto(savedUser);

	}
	
	@Override
	@Transactional
	public void verifyEmail(String email, int code) {
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

	    if (user.isEnabled()) {
	        throw new AlreadyValidException("Bu hesap zaten doğrulanmış!");
	    }

	    EmailVerificationToken token = emailVerificationTokenRepository
	            .findByUserAndCode(user, code)
	            .orElseThrow(() -> new InvalidCodeException("Doğrulama kodu hatalı!"));

	    if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
	        throw new TokenExpiredException("Doğrulama kodunun süresi dolmuş!");
	    }

	    user.setEnabled(true);
	    userRepository.save(user);

	    emailVerificationTokenRepository.delete(token);
	}
	
	@Override
	@Transactional
	public void resendVerification(String email) {
		
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

	    if (user.isEnabled()) {
	        throw new AlreadyValidException("Bu hesap zaten doğrulanmış.");
	    }

	    emailVerificationTokenRepository.deleteByUser(user);

	    int verificationCode = (int)(Math.random() * 900000) + 100000;

	    EmailVerificationToken token = new EmailVerificationToken();
	    token.setUser(user);
	    token.setCode(verificationCode);
	    token.setExpiryDate(LocalDateTime.now().plusHours(1));

	    emailVerificationTokenRepository.save(token);

	    this.emailService.sendRegisterVerificationCode(user.getEmail(), verificationCode);
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
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı."));
		UserDto userDto = userMapper.toDto(user);
		return userDto;
	}

	@Override
	public UserDtoPagedResponse getAllUsersPagedByUserIdDesc(int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
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
