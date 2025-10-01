package com.enesdernek.proje_yonetim_sistemi.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.enesdernek.proje_yonetim_sistemi.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

	@Value("${jwt.secret}")
	private String SECRET_KEY;

	public String generateToken(User user) {
	    Map<String, Object> claimsMap = new HashMap<>();
	    claimsMap.put("role", user.getRole().name());
	    claimsMap.put("email", user.getEmail()); 
	    
	    return Jwts.builder()
	            .setSubject(user.getEmail()) 
	            .addClaims(claimsMap)
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30)) // 30 gün
	            .signWith(getKey(), SignatureAlgorithm.HS256)
	            .compact();
	}

	public Key getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public Object getClaimsByKey(String token,String key) {
		Claims claims = getClaims(token);
		return claims.get(key);
	}

	public Claims getClaims(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
		return claims;
	}

	public <T> T exportToken(String token, Function<Claims, T> claimsFunction) {
		Claims claims = getClaims(token);

		return claimsFunction.apply(claims);
	}

	
	public String getEmailByToken(String token) {
	    return (String) getClaimsByKey(token, "email");
	}

	public boolean isTokenExpired(String token) {
		Date expiredDate = exportToken(token, Claims::getExpiration);
		return new Date().after(expiredDate);
	}

}