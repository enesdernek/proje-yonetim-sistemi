package com.enesdernek.proje_yonetim_sistemi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
@Profile("dev") 
public class DotenvDevConfig {
    static {
        Dotenv dotenv = Dotenv.configure()
                               .filename(".development.env")
                               .load();

        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME"));
        System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD"));
    }
}