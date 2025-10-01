package com.enesdernek.proje_yonetim_sistemi.core.utilities.results;

import lombok.Data;

@Data
public class SuccessResult extends Result{

	public SuccessResult(String message) {
		super(true,message);
	} 

}
