package com.example.demo.controller;

import com.example.demo.Service.ProcessCsvPdfService;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pdf")

public class PdfController {
   
    @Autowired
    private ProcessCsvPdfService csvPdfService;
    private static final Logger logger = LoggerFactory.getLogger(PdfController.class);

//    @PostMapping("/upload")
//    public ResponseEntity<?> handleCsvUpload(@RequestParam("file") MultipartFile file) {
//        try {
//            if (file.isEmpty()) {
//                return ResponseEntity.badRequest().body("Uploaded file is empty.");
//            }
//
//            List<String> uploadedUrls = csvPdfService.processCsvAndGeneratePdfs(file);
//            return ResponseEntity.ok(uploadedUrls);
//        } catch (Exception e) {
//            logger.error("Failed to process uploaded CSV", e);
//            return ResponseEntity.internalServerError().body("Error processing CSV and generating PDFs.");
//        }
//    }
}
