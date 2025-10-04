package com.enesdernek.proje_yonetim_sistemi.service.concretes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.enesdernek.proje_yonetim_sistemi.service.abstracts.FileStorageService;

@Service
public class FileStorageManager implements FileStorageService{
	
	private static final String BASE_DIR = "uploads/";
	
	public String saveFile(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) return null;
        try {
            Path uploadPath = Paths.get(BASE_DIR, subFolder);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + subFolder + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Dosya kaydedilemedi: " + e.getMessage());
        }
    }
	
	public boolean deleteFileIfExist(String subFolder, String fileName) {
        try {
            Path filePath = Paths.get(BASE_DIR, subFolder, fileName);
            if (Files.exists(filePath)) {
                return Files.deleteIfExists(filePath);
            }
            return false; 
        } catch (IOException e) {
            throw new RuntimeException("Dosya silinemedi: " + e.getMessage());
        }
    }
	
	

}
