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
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyConnectedException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.AlreadyValidException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.EmailAlreadyExistsException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.FalsePasswordException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidCodeException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidConnectionException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.InvalidPasswordException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.NotFoundException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.TokenExpiredException;
import com.enesdernek.proje_yonetim_sistemi.exception.exceptions.UnauthorizedActionException;

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
	
	@ExceptionHandler(InvalidPasswordException.class)
	public ResponseEntity<ErrorResult> handleInvalidPasswordException(InvalidPasswordException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(FalsePasswordException.class)
	public ResponseEntity<ErrorResult> handleFalsePasswordException(FalsePasswordException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(InvalidCodeException.class)
	public ResponseEntity<ErrorResult> handleInvalidCodeException(InvalidCodeException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(AlreadyValidException.class)
	public ResponseEntity<ErrorResult> handleAlreadyValidException(AlreadyValidException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(TokenExpiredException.class)
	public ResponseEntity<ErrorResult> handleTokenExpiredException(TokenExpiredException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(InvalidConnectionException.class)
	public ResponseEntity<ErrorResult> handleInvalidConnectionException(InvalidConnectionException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(UnauthorizedActionException.class)
	public ResponseEntity<ErrorResult> handleUnauthorizedActionException(UnauthorizedActionException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(AlreadyConnectedException.class)
	public ResponseEntity<ErrorResult> handleAlreadyConnectedException(AlreadyConnectedException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(AlreadyExistsException.class)
	public ResponseEntity<ErrorResult> handleAlreadyExistsException(AlreadyExistsException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorResult> handleNotFoundException(NotFoundException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ErrorResult> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
	    ErrorResult error = new ErrorResult(ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

}
