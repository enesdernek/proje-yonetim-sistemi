package com.enesdernek.proje_yonetim_sistemi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoIU {

    @Size(min = 2, max = 32)
    @NotNull
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username sadece harf ve sayı içerebilir, boşluk ve özel karakter yasak")
    private String username;

    @Email
    @NotNull
    @NotBlank
    private String email;

    @Size(min = 8, max = 128)
    @NotNull
    @NotBlank
    private String password;

    @Size(min = 10, max = 10)
    @NotNull
    @NotBlank
    @Pattern(regexp = "^[0-9]+$", message = "Telefon sadece rakamlardan oluşmalıdır")
    private String phone;

    @NotNull
    @NotBlank
    @Size(min = 2, max = 512)
    private String address;

    private LocalDateTime createdAt = LocalDateTime.now();


}
