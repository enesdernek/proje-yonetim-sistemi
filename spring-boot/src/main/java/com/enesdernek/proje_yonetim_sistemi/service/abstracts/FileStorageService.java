package com.enesdernek.proje_yonetim_sistemi.service.abstracts;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

	public String saveFile(MultipartFile file, String subFolder);
	
	public boolean deleteFileIfExist(String subFolder, String fileName);
}
