package com.cosmetics.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import javax.imageio.ImageIO;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads/products}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_WIDTH = 2000;
    private static final int MAX_HEIGHT = 2000;
    private static final int MIN_WIDTH = 300;
    private static final int MIN_HEIGHT = 300;
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    public String storeFile(MultipartFile file) throws IOException {
        validateFile(file);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;

        // Store file
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Could not delete file: " + fileName);
        }
    }

    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir).resolve(fileName);
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                String.format("File size exceeds maximum allowed size of %d MB", MAX_FILE_SIZE / (1024 * 1024))
            );
        }

        // Check content type
        String contentType = file.getContentType();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                "Invalid file type. Allowed types: JPEG, PNG, WebP"
            );
        }

        // Check image dimensions
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new IllegalArgumentException("Invalid image file");
            }

            int width = image.getWidth();
            int height = image.getHeight();

            if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                throw new IllegalArgumentException(
                    String.format("Image dimensions too small. Minimum: %dx%d pixels", MIN_WIDTH, MIN_HEIGHT)
                );
            }

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                throw new IllegalArgumentException(
                    String.format("Image dimensions too large. Maximum: %dx%d pixels", MAX_WIDTH, MAX_HEIGHT)
                );
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not read image file", e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    public static class FileUploadRestrictions {
        public static final long MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);
        public static final int MAX_WIDTH_PX = MAX_WIDTH;
        public static final int MAX_HEIGHT_PX = MAX_HEIGHT;
        public static final int MIN_WIDTH_PX = MIN_WIDTH;
        public static final int MIN_HEIGHT_PX = MIN_HEIGHT;
        public static final List<String> ALLOWED_FORMATS = Arrays.asList("JPEG", "PNG", "WebP");
    }
}