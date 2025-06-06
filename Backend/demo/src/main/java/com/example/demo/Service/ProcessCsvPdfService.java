package com.example.demo.Service;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessCsvPdfService {

//    private final SupabaseService supabaseService;
//    private static final Logger logger = LoggerFactory.getLogger(ProcessCsvPdfService.class);
//
//    public List<String> processCsvAndGeneratePdfs(MultipartFile file) {
//        List<String> uploadedUrls = new ArrayList<>();
//
//        try (
//            Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
//            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())
//        ) {
//            for (CSVRecord record : csvParser) {
//                if (record.isConsistent()) {
//                    String name = record.get("name");
//                    String percentage = record.get("percentage");
////                    String contact = record.get("contactNo");
////
////                    if (isBlank(name) || isBlank(email)) {
////                        logger.warn("Skipping record due to missing required fields: {}", record);
////                        continue;
////                    }
//
//                    byte[] pdfBytes = generatePdf(name, percentage);
//                    String safeName = sanitizeFileName(name);
//                    String fileName = safeName + "_" + System.currentTimeMillis() + ".pdf";
//
//                    String uploadedUrl = supabaseService.uploadPdf(fileName, pdfBytes);
//                    uploadedUrls.add(uploadedUrl);
//                } else {
//                    logger.warn("Skipping inconsistent record: {}", record);
//                }
//            }
//        } catch (Exception e) {
//            logger.error("Error while processing CSV and generating PDFs", e);
//            throw new RuntimeException("Failed to process CSV and generate PDFs", e);
//        }
//
//        return uploadedUrls;
//    }
//
//    private byte[] generatePdf(String name, String percentage) {
//        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
//            PdfWriter writer = new PdfWriter(baos);
//            PdfDocument pdf = new PdfDocument(writer);
//            Document document = new Document(pdf);
//
//            document.add(new Paragraph("User Report"));
//            document.add(new Paragraph("Name: " + name));
//            document.add(new Paragraph("Email: " + percentage));
////            document.add(new Paragraph("Contact: " + contact));
//
//            document.close();
//            return baos.toByteArray();
//        } catch (Exception e) {
//            logger.error("PDF generation failed for: {}", name, e);
//            throw new RuntimeException("PDF generation failed", e);
//        }
//    }
//
//    private String sanitizeFileName(String name) {
//        return name.replaceAll("[^a-zA-Z0-9_\\-]", "_");
//    }
//
//    private boolean isBlank(String str) {
//        return str == null || str.trim().isEmpty();
//    }
//}
    
    

    
    
    
    
    
}