package com.enesdernek.proje_yonetim_sistemi.core.utilities.results;

import lombok.Data;

@Data
public class ErrorResult extends Result{
	
	public ErrorResult(String message) {
		super(false,message);
	} 

}
