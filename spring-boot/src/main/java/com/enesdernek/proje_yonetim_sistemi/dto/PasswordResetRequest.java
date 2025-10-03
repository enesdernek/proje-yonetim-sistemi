package com.enesdernek.proje_yonetim_sistemi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetRequest {
	
	private String email;

	@NotNull
	@NotBlank
	@Size(min = 8, max = 128)
	private String newPassword;
}
