package com.example.demo.controller;

import com.example.demo.model.Exam;
import com.example.demo.model.StudentData;
import com.example.demo.Service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable String id) {
        Optional<Exam> exam = examService.getExamById(id);
        return exam.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.createExam(exam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable String id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{examId}/upload")
    public ResponseEntity<List<StudentData>> uploadStudentData(
            @PathVariable String examId,
            @RequestParam("file") MultipartFile file) {
        try {
            List<StudentData> studentData = examService.processStudentData(file);
            return ResponseEntity.ok(studentData);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{examId}/generate-certificates")
    public ResponseEntity<byte[]> generateCertificates(
            @PathVariable String examId,
            @RequestBody List<StudentData> students,
            @RequestParam("templateId") int templateId) {
        byte[] certificates = examService.generateCertificates(examId, students, templateId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificates.zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(certificates);
    }
}