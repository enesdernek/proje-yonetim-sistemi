package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.PasswordResetToken;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	
	Optional<PasswordResetToken> findByToken(String token);

	void deleteByUser(User user);
}
