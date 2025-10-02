package com.enesdernek.proje_yonetim_sistemi.exception.exceptions;

public class TokenExpiredException extends RuntimeException{
	
	public TokenExpiredException(String message) {
		super(message);
	}

}
