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

@Entity
@Table(name="email_change_token")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailChangeToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String newEmail;

	private String token;

	private LocalDateTime expiryDate;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

}
