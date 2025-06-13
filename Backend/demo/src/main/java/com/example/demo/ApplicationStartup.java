package com.example.demo;
import com.example.demo.Service.CertificateTemplateService;
import com.example.demo.model.CertificateTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ApplicationStartup {
    @Autowired
    private CertificateTemplateService templateService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            List<CertificateTemplate> templates = templateService.getAllTemplates();
            for (CertificateTemplate template : templates) {
                if (template.getPreviewImageUrl() == null) {
                    System.out.println("Generating preview for template: " + template.getName());
                    templateService.generateAndUploadPreviewImage(template.getId());
                }
            }
        } catch (Exception e) {
            System.err.println("Error generating previews on startup: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
