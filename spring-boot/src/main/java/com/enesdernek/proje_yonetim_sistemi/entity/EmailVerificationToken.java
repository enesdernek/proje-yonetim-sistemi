package com.enesdernek.proje_yonetim_sistemi.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="email_verification_token")
@Entity
public class EmailVerificationToken {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailVerificationTokenId;

    private Integer code; 
    private LocalDateTime expiryDate; 

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
}
