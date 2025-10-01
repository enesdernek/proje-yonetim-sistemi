package com.enesdernek.proje_yonetim_sistemi.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.ErrorDataResult;
import com.enesdernek.proje_yonetim_sistemi.core.utilities.results.ErrorResult;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.EmailAlreadyExistsException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorDataResult<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
	    Map<String, String> errors = new HashMap<>();

	    ex.getBindingResult().getFieldErrors().forEach(error -> {
	        errors.put(error.getField(), error.getDefaultMessage());
	    });

	    ErrorDataResult<Map<String, String>> result = new ErrorDataResult<>(errors, "Doğrulama hatası oluştu");

	    return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ErrorResult> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

}
