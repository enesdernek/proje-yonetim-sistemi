package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.EmailChangeToken;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface EmailChangeTokenRepository extends JpaRepository<EmailChangeToken, Long>{
	Optional<EmailChangeToken> findByToken(String token);
    void deleteByUser(User user);
}
