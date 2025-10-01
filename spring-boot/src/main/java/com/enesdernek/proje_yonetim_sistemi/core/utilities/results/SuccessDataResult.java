package com.enesdernek.proje_yonetim_sistemi.core.utilities.results;

import lombok.Data;

@Data
public class SuccessDataResult<T>extends DataResult {

	public SuccessDataResult(T data, String message) {
		super(data, true, message);
	}

}
