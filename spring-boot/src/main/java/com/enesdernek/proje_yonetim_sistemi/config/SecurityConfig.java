package com.enesdernek.proje_yonetim_sistemi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.enesdernek.proje_yonetim_sistemi.jwt.AuthEntryPoint;
import com.enesdernek.proje_yonetim_sistemi.jwt.JwtAuthenticationFilter;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	public static final String[] PERMIT_ALL_ENDPOINTS = {
		    "/api/users/authenticate",
		    "/api/users/register",
		    "/v3/api-docs/**",
		    "/swagger-ui/**",
		    "/swagger-ui.html",
		    "/api/connections/get-connections-paged",
             "/api/users/verify-email",	
		    "/api/users/resend-email-verification",
		    "/api/users/send-reset-password-email",
		    "/api/users/reset-password"
		};

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private JwtAuthenticationFilter authenticationFilter;

    @Autowired
    private AuthEntryPoint authEntryPoint;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .authorizeRequests(request -> request
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS metodunu herkese aç
                .requestMatchers(PERMIT_ALL_ENDPOINTS).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(customAccessDeniedHandler)
            );

        return http.build();
    }
}
