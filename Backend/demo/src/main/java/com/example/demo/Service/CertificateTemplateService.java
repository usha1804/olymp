
package com.example.demo.Service;

import com.example.demo.Repository.CertificateTemplateRepository;
import com.example.demo.dto.CertificateRequest;
import com.example.demo.model.CertificateTemplate;
import com.example.demo.model.User;
import com.example.demo.Repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CertificateTemplateService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final TemplateEngine templateEngine;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CertificateTemplateRepository templateRepository;

    public CertificateTemplateService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generatePdf(CertificateRequest cert) throws IOException {
        try {
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            CertificateTemplate template = templateRepository.findById(Long.parseLong(cert.getTemplateName()))
                    .orElseThrow(() -> new IllegalArgumentException("Template not found with ID: " + cert.getTemplateName()));

            Context context = new Context();
            context.setVariable("name", user.getName());
            context.setVariable("email", user.getEmail());
            context.setVariable("phone", user.getPhone());
            context.setVariable("percentage", cert.getPercentage());
            context.setVariable("subject", cert.getSubject());
            context.setVariable("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

            String htmlContent = templateEngine.process(template.getName(), context);

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

    public void uploadToSupabase(byte[] pdfBytes, String subject, String studentName) throws IOException, InterruptedException {
        String safeStudentName = studentName.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
        String safeSubject = subject.trim().replaceAll("[^a-zA-Z0-9_-]", "_");
        
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

    public void processCertificates(List<CertificateRequest> certificates) throws IOException, InterruptedException {
        for (CertificateRequest cert : certificates) {
            User user = userRepository.findById(cert.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + cert.getUserId()));

            byte[] pdfBytes = generatePdf(cert);
            uploadToSupabase(pdfBytes, cert.getSubject(), user.getName());
        }
    }

    public List<CertificateTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public String generateAndUploadPreviewImage(Long templateId) throws IOException, InterruptedException {
    System.out.println("Generating preview for template ID: " + templateId);
    CertificateTemplate template = templateRepository.findById(templateId)
            .orElseThrow(() -> new IllegalArgumentException("Template not found with ID: " + templateId));

    Context context = new Context();
    context.setVariable("name", "John Doe");
    context.setVariable("email", "john@example.com");
    context.setVariable("phone", "1234567890");
    context.setVariable("percentage", "95%");
    context.setVariable("subject", "Mathematics");
    context.setVariable("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

    System.out.println("Processing template: " + template.getName());
    String htmlContent = templateEngine.process(template.getName(), context);

    ByteArrayOutputStream pdfOutput = new ByteArrayOutputStream();
    PdfRendererBuilder builder = new PdfRendererBuilder();
    builder.withHtmlContent(htmlContent, null);
    builder.toStream(pdfOutput);
    builder.useFastMode();
    builder.run();

    System.out.println("Converting PDF to PNG");
    ByteArrayInputStream pdfInput = new ByteArrayInputStream(pdfOutput.toByteArray());
    PDDocument document = PDDocument.load(pdfInput);
    PDFRenderer pdfRenderer = new PDFRenderer(document);
    BufferedImage image = pdfRenderer.renderImageWithDPI(0, 300);

    ByteArrayOutputStream imageOutput = new ByteArrayOutputStream();
    ImageIO.write(image, "PNG", imageOutput);
    document.close();

    String safeTemplateName = template.getName().replaceAll("[^a-zA-Z0-9_-]", "_");
    String imagePath = "previews/" + safeTemplateName + ".png";
    System.out.println("Uploading image to Supabase: " + imagePath);

    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + imagePath))
            .header("apikey", supabaseKey)
            .header("Authorization", "Bearer " + supabaseKey)
            .header("Content-Type", "image/png")
            .PUT(HttpRequest.BodyPublishers.ofByteArray(imageOutput.toByteArray()))
            .build();

    HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() != 200 && response.statusCode() != 201) {
        System.err.println("Failed to upload preview image. Status: " + response.statusCode() + ", Body: " + response.body());
        throw new RuntimeException("Failed to upload preview image: " + response.body());
    }

    String previewUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + imagePath;
    System.out.println("Preview URL generated: " + previewUrl);
    template.setPreviewImageUrl(previewUrl);
    templateRepository.save(template);

    return previewUrl;
}
}
