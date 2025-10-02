package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

public interface EmailService {
	
	void sendRegisterVerificationCode(String email, int verificationCode);

}
