package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.EmailVerificationToken;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long>{
	
    Optional<EmailVerificationToken> findByUserAndToken(User user, String token);
    
    Optional<EmailVerificationToken> findByToken(String token);
    
    void deleteByUser(User user);


}
