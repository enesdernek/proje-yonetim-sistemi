package com.enesdernek.proje_yonetim_sistemi.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "connections")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Connection {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long connectionId;

	private Long userId;

	private LocalDateTime createdAt;

	private Long connectedUserId;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

}
