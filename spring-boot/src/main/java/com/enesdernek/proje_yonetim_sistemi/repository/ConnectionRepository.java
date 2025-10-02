package com.enesdernek.proje_yonetim_sistemi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.enesdernek.proje_yonetim_sistemi.entity.Connection;

public interface ConnectionRepository extends JpaRepository<Connection, Long>{
      
    boolean existsByUserIdAndConnectedUserId(Long userId, Long connectedUserId);
	
}
