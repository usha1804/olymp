package com.example.demo.controller;

import com.example.demo.model.Exam;
import com.example.demo.Service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String supabaseApiKey;

    @Value("${supabase.bucket-name}")
    private String bucketName;

    // 🔵 Get all exams
    @GetMapping("/exams")
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }
    @DeleteMapping("/exams/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable UUID id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }

    // 🔵 Add exam
    @PostMapping("/exams")
    public ResponseEntity<Exam> addExam(@RequestBody Exam exam) {
        Exam savedExam = examService.saveExam(exam);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExam);
    }

    // 🔵 Upload image to Supabase Storage bucket
    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String fileType = file.getContentType();

            if (!List.of("image/jpeg", "image/jpg", "image/png").contains(fileType)) {
                return ResponseEntity.badRequest().body("Invalid file type.");
            }

            // Generate unique file name
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

            // Supabase Storage upload URL
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

            // Create HTTP client
            HttpClient client = HttpClient.newHttpClient();

            // Build HTTP PUT request with file bytes and necessary headers
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("apikey", supabaseApiKey)
                    .header("Authorization", "Bearer " + supabaseApiKey)
                    .header("Content-Type", fileType)
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            // Send request and get response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                // Construct public URL assuming bucket is public
                String imageUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
                return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
            } else {
                return ResponseEntity.status(response.statusCode())
                        .body(Map.of("error", "Upload failed: " + response.body()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image to Supabase"));
        }
    }
    
}
