package com.enesdernek.proje_yonetim_sistemi.core.utilities.results;

import lombok.Data;

@Data
public class ErrorDataResult<T>extends DataResult {

	public ErrorDataResult(T data, String message) {
		super(data, false, message);
	}

}
