package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.dto.PasswordChangeRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.PasswordResetRequest;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDto;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoAuthIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoIU;
import com.enesdernek.proje_yonetim_sistemi.dto.UserDtoPagedResponse;
import com.enesdernek.proje_yonetim_sistemi.entity.EmailChangeToken;
import com.enesdernek.proje_yonetim_sistemi.entity.EmailVerificationToken;
import com.enesdernek.proje_yonetim_sistemi.entity.PasswordResetToken;
import com.enesdernek.proje_yonetim_sistemi.entity.Role;
import com.enesdernek.proje_yonetim_sistemi.entity.User;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyValidException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.FalsePasswordException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidCodeException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidPasswordException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.TokenExpiredException;
import com.enesdernek.proje_yonetim_sistemi.jwt.AuthResponse;
import com.enesdernek.proje_yonetim_sistemi.jwt.JwtService;
import com.enesdernek.proje_yonetim_sistemi.mapper.UserMapper;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.ConnectionRequestRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.EmailChangeTokenRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.EmailVerificationTokenRepository;
import com.enesdernek.proje_yonetim_sistemi.repository.PasswordResetTokenRepository;
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
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private EmailChangeTokenRepository emailChangeTokenRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private ConnectionRepository connectionRepository;

	@Autowired
	private ConnectionRequestRepository connectionRequestRepository;

	@Override
	@Transactional
	public UserDto register(UserDtoIU userDtoIU) {

		Optional<User> existingUserOpt = userRepository.findByEmail(userDtoIU.getEmail());

		boolean isExistsByUsername = this.userRepository.existsByUsername(userDtoIU.getUsername());

		if (isExistsByUsername) {
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
		User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		if (user.isEnabled()) {
			throw new AlreadyValidException("Bu hesap zaten doğrulanmış!");
		}

		EmailVerificationToken token = emailVerificationTokenRepository.findByUserAndCode(user, code)
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

		User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		if (user.isEnabled()) {
			throw new AlreadyValidException("Bu hesap zaten doğrulanmış.");
		}

		emailVerificationTokenRepository.deleteByUser(user);

		int verificationCode = (int) (Math.random() * 900000) + 100000;

		EmailVerificationToken token = new EmailVerificationToken();
		token.setUser(user);
		token.setCode(verificationCode);
		token.setExpiryDate(LocalDateTime.now().plusMinutes(5));

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

	@Override
	public void changePassword(Long userId, PasswordChangeRequest request) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
			throw new FalsePasswordException("Mevcut şifre yanlış.");
		}

		if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
			throw new InvalidPasswordException("Yeni şifre eski şifre ile aynı olamaz.");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

	}

	@Override
	@Transactional
	public void sendResetPasswordEmail(String email) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		passwordResetTokenRepository.deleteByUser(user);

		int code = (int) (100000 + Math.random() * 900000);

		LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

		PasswordResetToken token = new PasswordResetToken();
		token.setCode(code);
		token.setUser(user);
		token.setExpiryDate(expiry);
		passwordResetTokenRepository.save(token);

		emailService.sendResetPasswordCode(user.getEmail(), code);
	}

	@Override
	@Transactional
	public void resetPassword(PasswordResetRequest request, int code) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		PasswordResetToken token = passwordResetTokenRepository.findByUserAndCode(user, code)
				.orElseThrow(() -> new InvalidCodeException("Kod hatalı!"));

		if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("Kodun süresi dolmuş!");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

		passwordResetTokenRepository.delete(token);

	}

	@Override
	@Transactional
	public void sendChangeEmailAdressEmail(Long userId, String newEmail, String currentPassword) {
		User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new FalsePasswordException("Mevcut şifre hatalı!");
		}

		if (userRepository.existsByEmail(newEmail)) {
			throw new AlreadyExistsException("Bu email zaten kullanılıyor!");
		}

		emailChangeTokenRepository.deleteByUser(user);

		String token = UUID.randomUUID().toString();
		LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

		EmailChangeToken emailChangeToken = new EmailChangeToken();
		emailChangeToken.setUser(user);
		emailChangeToken.setNewEmail(newEmail);
		emailChangeToken.setToken(token);
		emailChangeToken.setExpiryDate(expiryDate);

		emailChangeTokenRepository.save(emailChangeToken);

		emailService.sendChangeEmailVerification(newEmail, user.getUsername(), token);
	}

	@Override
	@Transactional
	public void changeEmail(String token) {
		EmailChangeToken emailChangeToken = emailChangeTokenRepository.findByToken(token)
				.orElseThrow(() -> new NotFoundException("Geçersiz veya bulunamadı"));

		if (emailChangeToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("Token süresi dolmuş!");
		}

		User user = emailChangeToken.getUser();
		user.setEmail(emailChangeToken.getNewEmail());
		userRepository.save(user);

		emailChangeTokenRepository.delete(emailChangeToken);

	}

	@Override
	@Transactional
	public void deleteByUserId(Long userId) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		connectionRepository.deleteByUserIdOrConnectedUserId(userId, userId);
		connectionRequestRepository.deleteBySenderIdOrReceiverId(userId, userId);

		this.userRepository.deleteById(userId);

	}

}
