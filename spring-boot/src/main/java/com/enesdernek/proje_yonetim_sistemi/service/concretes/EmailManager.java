package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.enesdernek.proje_yonetim_sistemi.service.abstracts.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailManager implements EmailService {

	private final JavaMailSender mailSender;

	@Value("${app.frontend.url}")
	private String frontendUrl;

	public EmailManager(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	@Override
	public void sendRegisterVerificationEmail(String email, String token) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(email);
			helper.setSubject("Hesap Doğrulama");

			String verificationUrl = frontendUrl + "/verify-email?token=" + token;

			String htmlContent = "<!DOCTYPE html>" + "<html>" + "<head>" + "  <meta charset='UTF-8'>" + "  <style>"
					+ "    .container { font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; }"
					+ "    .card { background-color: #2b2b2b; color: #ffffff; padding: 20px; border-radius: 8px;"
					+ "            box-shadow: 0 2px 6px rgba(0,0,0,0.3); }" + "    h2 { color: #ffffff; }"
					+ "    p { line-height: 1.6; }" + "  </style>" + "</head>" + "<body>" + "  <div class='container'>"
					+ "    <div class='card'>" + "      <h2>Hesabınızı Doğrulayın</h2>" + "      <p>Merhaba,</p>"
					+ "      <p>Hesabınızı etkinleştirmek için aşağıdaki butona tıklayın. Bu bağlantı <b>15 dakika</b> boyunca geçerlidir.</p>"
					+ "      <a href='" + verificationUrl + "' "
					+ "         style='display:inline-block; margin-top:20px; padding:12px 20px;"
					+ "                background-color:#444444; color:#ffffff; text-decoration:none;"
					+ "                border-radius:5px; font-weight:bold;'>Hesabımı Doğrula</a>" + "    </div>"
					+ "  </div>" + "</body>" + "</html>";

			helper.setText(htmlContent, true);
			mailSender.send(mimeMessage);

		} catch (MessagingException e) {
			throw new RuntimeException("Doğrulama maili gönderilemedi", e);
		}
	}

	@Override
	public void sendResetPasswordEmail(String email, String token) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(email);
			helper.setSubject("Şifre Sıfırlama İsteği");

			String resetUrl = frontendUrl + "/reset-password?token=" + token;

			String htmlContent = "<!DOCTYPE html>" + "<html>" + "<head>" + "  <meta charset='UTF-8'>" + "  <style>"
					+ "    body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }"
					+ "    .container { padding: 20px; }"
					+ "    .card { background-color: #2b2b2b; color: #ffffff; padding: 25px; border-radius: 8px;"
					+ "            box-shadow: 0 2px 6px rgba(0,0,0,0.3); max-width: 600px; margin: auto; }"
					+ "    h2 { color: #ffffff; }" + "    p { line-height: 1.6; }"
					+ "    .btn { display: inline-block; margin-top: 20px; padding: 12px 20px;"
					+ "           background-color: #007bff; text-decoration: none;"
					+ "           border-radius: 5px; font-weight: bold;" + "           color: #ffffff !important; }" + // inline
																														// veya
																														// !important
																														// ile
																														// garantili
																														// beyaz
					"    .btn:hover { background-color: #0056b3; }" + "  </style>" + "</head>" + "<body>"
					+ "  <div class='container'>" + "    <div class='card'>" + "      <h2>Şifre Sıfırlama</h2>"
					+ "      <p>Şifre sıfırlama işlemi yapmak için aşağıdaki butona tıklayın. Bu bağlantı <b>15 dakika</b> boyunca geçerlidir.</p>"
					+ "      <a href='" + resetUrl + "' class='btn' style='color:#ffffff;'>Şifremi Sıfırla</a>" + // inline
																													// stil
					"    </div>" + "  </div>" + "</body>" + "</html>";

			helper.setText(htmlContent, true); // HTML olarak gönder

			mailSender.send(mimeMessage);

		} catch (MessagingException e) {
			throw new RuntimeException("Şifre sıfırlama maili gönderilemedi", e);
		}
	}

	@Override
	public void sendChangeEmailVerification(String newEmail, String name, String token) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(newEmail);
			helper.setSubject("Email Değişiklik Doğrulama");

			String verificationUrl = frontendUrl + "/change-email?token=" + token;

			String htmlContent = "<!DOCTYPE html>" + "<html>" + "<head>" + "  <meta charset='UTF-8'>" + "  <style>"
					+ "    body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }"
					+ "    .container { padding: 20px; }"
					+ "    .card { background-color: #2b2b2b; color: #ffffff; padding: 25px; border-radius: 8px;"
					+ "            box-shadow: 0 2px 6px rgba(0,0,0,0.3); max-width: 600px; margin: auto; }"
					+ "    h2 { color: #ffffff; }" + "    p { line-height: 1.6; }" + "  </style>" + "</head>" + "<body>"
					+ "  <div class='container'>" + "    <div class='card'>" + "      <h2>Email Değişiklik Onayı</h2>"
					+ "      <p>Merhaba <b>" + name + "</b>,</p>"
					+ "      <p>Email adresinizi değiştirmek için aşağıdaki butona tıklayın. Bu bağlantı <b>15 dakika</b> boyunca geçerlidir.</p>"
					+ "      <a href='" + verificationUrl + "' "
					+ "         style='display:inline-block; margin-top:20px; padding:12px 20px;"
					+ "                background-color:#007bff; color:#ffffff; text-decoration:none;"
					+ "                border-radius:5px; font-weight:bold;'>Emailimi Değiştir</a>" + "    </div>"
					+ "  </div>" + "</body>" + "</html>";

			helper.setText(htmlContent, true);
			mailSender.send(mimeMessage);

		} catch (MessagingException e) {
			throw new RuntimeException("Email değişiklik doğrulama maili gönderilemedi", e);
		}
	}

}
