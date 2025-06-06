package com.example.demo.controller;

import com.example.demo.Service.CertificateTemplateService;
import com.example.demo.dto.CertificateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class CertificateTemplateController {

    private final CertificateTemplateService service;

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
            e.printStackTrace(); // important for backend debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("error", "Internal server error: " + e.getMessage()));
        }
    }
}
