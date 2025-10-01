package com.enesdernek.proje_yonetim_sistemi.jwt;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.ErrorResult;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message;
        if (authException instanceof BadCredentialsException) {
            message = "E-posta veya şifre hatalı.";
        } else {
            message = "Yetkilendirme gerekiyor: " + authException.getMessage();
        }

        ErrorResult error = new ErrorResult(message);

        String json = objectMapper.writeValueAsString(error);
        response.getWriter().write(json);
    }
}