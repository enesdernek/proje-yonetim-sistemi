package com.enesdernek.proje_yonetim_sistemi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePhoneRequest {
	
	 @Size(min = 10, max = 10)
	    @NotNull
	    @NotBlank
	    @Pattern(regexp = "^[0-9]+$", message = "Telefon sadece rakamlardan oluşmalıdır")
	    private String phone;

}
