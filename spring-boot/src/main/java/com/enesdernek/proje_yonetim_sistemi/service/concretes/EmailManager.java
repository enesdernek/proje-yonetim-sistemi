package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.service.abstracts.EmailService;

@Service
public class EmailManager implements EmailService {

	private final JavaMailSender mailSender;

	public EmailManager(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	@Override
	public void sendRegisterVerificationCode(String email, int verificationCode) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("Hesap Doğrulama Kodu");
		message.setText("Doğrulama kodunuz: " + verificationCode);
		mailSender.send(message);
	}

}
