package com.example.demo.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.CertificateRequest;
import com.example.demo.model.User;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

@Service
public class CertificateTemplateService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final TemplateEngine mytemplateEngine;
    
    @Autowired
    private UserRepository userRepository;

    public CertificateTemplateService(TemplateEngine templateEngine) {
        this.mytemplateEngine = templateEngine;
    }

    // ✅ Generate PDF from HTML template using Thymeleaf
    public byte[] generatePdf(CertificateRequest cert) throws IOException {
        try {
            // Fetch user from DB
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("name", user.getName());
            context.setVariable("email", user.getEmail());
            context.setVariable("phone", user.getPhone());
            context.setVariable("percentage", cert.getPercentage());
            context.setVariable("subject", cert.getSubject());
            context.setVariable("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            
            
            String template = cert.getTemplateName(); // should be "template1", "template2", etc.
            if (template == null || template.isBlank()) {
                throw new IllegalArgumentException("Template name is missing in request");
            }

            // Process the template
            String htmlContent = mytemplateEngine.process("certificate", context);

            // Generate PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.useFastMode();
            builder.run();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new IOException("Error generating PDF", e);
        }
    }


    // ✅ Upload PDF to Supabase, storing inside folder for each student
 // ✅ Upload PDF to Supabase, storing inside certificates/{studentName}/{subject}.pdf
    public void uploadToSupabase(byte[] pdfBytes, String subject, String studentName) throws IOException, InterruptedException {
        String safeStudentName = studentName.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
        String safeSubject = subject.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
        
        // Final path: certificates/studentName/subject.pdf
        String filePath = "certificates/" + safeStudentName + "/" + safeSubject + ".pdf";

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + filePath))
            .header("apikey", supabaseKey)
            .header("Authorization", "Bearer " + supabaseKey)
            .header("Content-Type", "application/pdf")
            .PUT(HttpRequest.BodyPublishers.ofByteArray(pdfBytes))
            .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            throw new RuntimeException("Failed to upload PDF: " + response.body());
        }
    }

    // ✅ Process and upload multiple certificates
    public void processCertificates(List<CertificateRequest> certificates) throws IOException, InterruptedException {
        for (CertificateRequest cert : certificates) {
            // Fetch user info
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            byte[] pdfBytes = generatePdf(cert);

            // Use name from DB for folder
            uploadToSupabase(pdfBytes, cert.getSubject(), user.getName());
        }
    }
}

