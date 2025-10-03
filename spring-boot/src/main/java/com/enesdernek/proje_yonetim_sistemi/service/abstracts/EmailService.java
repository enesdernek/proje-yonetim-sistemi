package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

public interface EmailService {

	void sendRegisterVerificationCode(String email, int verificationCode);

	void sendResetPasswordCode(String email, int code);

	void sendChangeEmailVerification(String newEmail, String name, String token);
}
