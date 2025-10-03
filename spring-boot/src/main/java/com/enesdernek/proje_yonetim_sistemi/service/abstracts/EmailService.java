package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

public interface EmailService {

	void sendRegisterVerificationEmail(String email, String token);

	void sendResetPasswordEmail(String email, String token);

	void sendChangeEmailVerification(String newEmail, String name, String token);
}
