package com.enesdernek.proje_yonetim_sistemi.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {
		
		
		
		 if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
		        filterChain.doFilter(request, response);
		        return;
		    }

		    String path = request.getServletPath();

		    // public endpointleri bypass et
		    if (path.equals("/api/users/authenticate") ||
		    	    path.equals("/api/users/register") ||
		    	    path.startsWith("/api/users/verify") ||
		    	    path.startsWith("/api/users/send-reset-password-email") ||
		    	    path.startsWith("/api/users/verify-new-email") ||
		    	    (path.equals("/api/awarenesses/get-all-paged") && "GET".equalsIgnoreCase(request.getMethod())) ||
		    	    (path.equals("/api/events/get-all-paged") && "GET".equalsIgnoreCase(request.getMethod())) ||
		    	    path.startsWith("/uploads") ||
		    	    path.startsWith("/swagger-ui") ||
		    	    path.startsWith("/v3/api-docs")) {
		    	    filterChain.doFilter(request, response);
		    	    return;
		    	}


	    // token kontrolü
	    String header = request.getHeader("Authorization");
	    if (header == null || !header.startsWith("Bearer ")) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    String token = header.substring(7);
	    try {
	        String email = jwtService.getEmailByToken(token);

	        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

	            if (userDetails != null && !jwtService.isTokenExpired(token)) {
	                UsernamePasswordAuthenticationToken authentication =
	                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
	                SecurityContextHolder.getContext().setAuthentication(authentication);
	            }
	        }
	    } catch (ExpiredJwtException e) {
	        System.out.println("Token süresi dolmuştur: " + e.getMessage());
	    } catch (Exception e) {
	        System.out.println("Genel bir hata oluştu: " + e.getMessage());
	    }

	    filterChain.doFilter(request, response);
	}
}