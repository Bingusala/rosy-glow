package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    // @Autowired
    // private FileStorageService fileStorageService;

    @PostMapping("/admin/upload/product-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            String fileUrl = "/api/files/" + fileName;
            
            Map<String, Object> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("fileUrl", fileUrl);
            response.put("originalName", file.getOriginalFilename());
            response.put("size", file.getSize());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Could not store file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(fileName);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/upload/restrictions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUploadRestrictions() {
        Map<String, Object> restrictions = new HashMap<>();
        restrictions.put("maxFileSizeMB", 5);
        restrictions.put("maxWidthPx", 2000);
        restrictions.put("maxHeightPx", 2000);
        restrictions.put("minWidthPx", 300);
        restrictions.put("minHeightPx", 300);
        restrictions.put("allowedFormats", Arrays.asList("JPEG", "PNG", "WebP"));
        
        return ResponseEntity.ok(restrictions);
    }
    
    @GetMapping("/admin/upload/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Upload controller working");
    }

    @DeleteMapping("/admin/files/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName) {
        try {
            fileStorageService.deleteFile(fileName);
            Map<String, String> response = new HashMap<>();
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Could not delete file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }
}