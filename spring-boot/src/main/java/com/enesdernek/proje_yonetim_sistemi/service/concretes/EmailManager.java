package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.service.abstracts.EmailService;

@Service
public class EmailManager implements EmailService {

	private final JavaMailSender mailSender;
	
	@Value("${app.frontend.url}")
    private String frontendUrl;

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
	
	@Override
    public void sendResetPasswordCode(String email,int code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Şifre Sıfırlama İsteği");
        message.setText(
                "Şifre sıfırlama kodunuz: " + code +
                "\nBu kod 5 dakika geçerlidir.");
        mailSender.send(message);
    }
	
	@Override
    public void sendChangeEmailVerification(String newEmail, String name, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(newEmail);
        message.setSubject("Email Değişiklik Doğrulama");
        message.setText("Merhaba " + name + ",\n\nEmail adresinizi değiştirmek için aşağıdaki linke tıklayın:\n"
                + frontendUrl + "/change-email?token=" + token + "\n\nBu link 15 dakika geçerlidir.");
        mailSender.send(message);
    }

}
