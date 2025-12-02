package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.dto.ChangePhoneRequest;
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

	@Autowired
	private FileStorageManager fileStorageManager;

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
				sendRegisterVerificationEmail(existingUser);

				return userMapper.toDto(existingUser);
			}
		}

		User user = userMapper.toEntity(userDtoIU);
		user.setPassword(passwordEncoder.encode(userDtoIU.getPassword()));
		user.setRole(Role.USER);
		user.setEnabled(false);

		User savedUser = userRepository.save(user);

		sendRegisterVerificationEmail(user);

		return userMapper.toDto(savedUser);

	}

	public void sendRegisterVerificationEmail(User existingUser) {
		emailVerificationTokenRepository.deleteByUser(existingUser);

		String token = UUID.randomUUID().toString();
		LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

		EmailVerificationToken verificationToken = new EmailVerificationToken();
		verificationToken.setUser(existingUser);
		verificationToken.setToken(token);
		verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

		this.emailVerificationTokenRepository.save(verificationToken);

		emailService.sendRegisterVerificationEmail(existingUser.getEmail(), token);
	}

	@Override
	@Transactional
	public void verifyEmail(String token) {
		EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
				.orElseThrow(() -> new InvalidCodeException("Doğrulama kodu hatalı!"));

		if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("Doğrulama kodunun süresi dolmuş!");
		}

		User user = verificationToken.getUser();

		if (user.isEnabled()) {
			throw new AlreadyValidException("Bu hesap zaten doğrulanmış!");
		}

		user.setEnabled(true);
		userRepository.save(user);

		emailVerificationTokenRepository.delete(verificationToken);
	}

	@Override
	@Transactional
	public void resendVerification(String email) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı"));

		if (user.isEnabled()) {
			throw new AlreadyValidException("Bu hesap zaten doğrulanmış.");
		}

		sendRegisterVerificationEmail(user);
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

		String token = UUID.randomUUID().toString();
		LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

		PasswordResetToken resetToken = new PasswordResetToken();
		resetToken.setToken(token);
		resetToken.setUser(user);
		resetToken.setExpiryDate(expiryDate);
		passwordResetTokenRepository.save(resetToken);

		emailService.sendResetPasswordEmail(resetToken.getUser().getEmail(), token);
	}

	@Override
	@Transactional
	public void resetPassword(PasswordResetRequest request, String token) {

		PasswordResetToken passwordResetToken = this.passwordResetTokenRepository.findByToken(token)
				.orElseThrow(() -> new NotFoundException("Token bulunamadı"));

		User user = passwordResetToken.getUser();

		if (passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("Kodun süresi dolmuş!");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

		passwordResetTokenRepository.delete(passwordResetToken);

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

	@Transactional
	public void changeEmail(String token, HttpServletRequest request, HttpServletResponse response) {
		EmailChangeToken emailChangeToken = emailChangeTokenRepository.findByToken(token)
				.orElseThrow(() -> new NotFoundException("Geçersiz veya bulunamadı"));

		if (emailChangeToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("Token süresi dolmuş!");
		}

		User user = emailChangeToken.getUser();
		user.setEmail(emailChangeToken.getNewEmail());
		userRepository.save(user);

		emailChangeTokenRepository.delete(emailChangeToken);

		SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			logoutHandler.logout(request, response, auth);
		}
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

	@Override
	public UserDto uploadProfileImageByUserId(Long userId, MultipartFile file) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		String oldImageUrl = user.getProfileImageUrl();
		if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
			String oldFileName = Paths.get(oldImageUrl).getFileName().toString();
			this.fileStorageManager.deleteFileIfExist("profile-images", oldFileName);
		}

		String newImageUrl = fileStorageManager.saveFile(file, "profile-images");
		user.setProfileImageUrl(newImageUrl);
		userRepository.save(user);

		return userMapper.toDto(user);
	}

	@Override
	public UserDto deleteProfileImageByUserId(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));

		String oldImageUrl = user.getProfileImageUrl();
		if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
			String oldFileName = Paths.get(oldImageUrl).getFileName().toString();
			fileStorageManager.deleteFileIfExist("profile-images", oldFileName);
		}

		user.setProfileImageUrl(null);
		userRepository.save(user);

		return userMapper.toDto(user);
	}

	@Override
	public UserDto changePhone(Long userId, ChangePhoneRequest request) {
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı."));
		user.setPhone(request.getPhone());
		User savedUser = this.userRepository.save(user);
		return this.userMapper.toDto(savedUser);
	}

}
