
package com.example.demo.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.CertificateTemplateService;
import com.example.demo.dto.CertificateRequest;
import com.example.demo.model.CertificateTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/templates")
public class CertificateTemplateController {

    private final CertificateTemplateService service;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.bucket}")
    private String bucket;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Autowired
    public CertificateTemplateController(CertificateTemplateService service) {
        this.service = service;
    }

    public static class ApiResponse {
        private String status;
        private String message;

        public ApiResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @PostMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> generateAndUploadCertificates(@RequestBody List<CertificateRequest> requests) {
        try {
            if (requests == null || requests.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("error", "Request body is empty or invalid"));
            }

            service.processCertificates(requests);

            return ResponseEntity.ok(
                    new ApiResponse("success", "Generated and uploaded " + requests.size() + " certificates")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Invalid input: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/preview/{templateName}")
    public String previewTemplate(@PathVariable String templateName, Model model) {
        model.addAttribute("name", "John Doe");
        model.addAttribute("email", "john@example.com");
        model.addAttribute("phone", "1234567890");
        model.addAttribute("percentage", "95%");
        model.addAttribute("subject", "Mathematics");
        model.addAttribute("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
        return templateName;
    }

    @GetMapping("/all")
    public ResponseEntity<List<CertificateTemplate>> getAllTemplates() {
        try {
            List<CertificateTemplate> templates = service.getAllTemplates();
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/generate-preview/{templateId}")
    public ResponseEntity<ApiResponse> generateTemplatePreview(@PathVariable Long templateId) {
        try {
            String previewUrl = service.generateAndUploadPreviewImage(templateId);
            return ResponseEntity.ok(new ApiResponse("success", "Preview generated and uploaded: " + previewUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to generate preview: " + e.getMessage()));
        }
    }

    @GetMapping("/certificates/student/{studentName}")
    public ResponseEntity<List<String>> getCertificatesByStudent(@PathVariable String studentName) throws IOException, InterruptedException {
        String path = "certificates/" + studentName + "/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .map(file -> {
                    String fileName = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/certificates/subject/{subjectName}")
    public ResponseEntity<List<String>> getCertificatesBySubject(@PathVariable String subjectName) throws IOException, InterruptedException {
        String path = "certificates/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .filter(file -> ((String) file.get("name")).endsWith("/" + subjectName + ".pdf"))
                .map(file -> {
                    String fullPath = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fullPath;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/certificates/all")
    public ResponseEntity<List<String>> getAllCertificates() throws IOException, InterruptedException {
        String path = "certificates/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/storage/v1/object/list/" + bucket + "?prefix=" + path))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return ResponseEntity.status(response.statusCode()).body(List.of("Error: " + response.body()));
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> files = objectMapper.readValue(response.body(), List.class);

        List<String> urls = files.stream()
                .filter(file -> ((String) file.get("name")).endsWith(".pdf"))
                .map(file -> {
                    String fullPath = (String) file.get("name");
                    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fullPath;
                })
                .toList();

        return ResponseEntity.ok(urls);
    }
}
