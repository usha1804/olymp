package com.example.demo.Service;

import com.example.demo.model.Exam;
import com.example.demo.model.StudentData;
import com.example.demo.Repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Optional<Exam> getExamById(String id) {
        return examRepository.findById(id);
    }

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public void deleteExam(String id) {
        examRepository.deleteById(id);
    }

    public List<StudentData> processStudentData(MultipartFile file) throws IOException {
        List<StudentData> studentData = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean firstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                
                String[] parts = line.split(",");
                if (parts.length >= 2) {
                    try {
                        StudentData student = new StudentData();
                        student.setName(parts[0].trim().replaceAll("\"", ""));
                        double percentage = Double.parseDouble(parts[1].trim());
                        student.setPercentage(percentage);
                        student.setEligible(percentage >= 75);
                        studentData.add(student);
                    } catch (NumberFormatException e) {
                        // Skip invalid entries
                        continue;
                    }
                }
            }
        }
        
        return studentData;
    }

    public byte[] generateCertificates(String examId, List<StudentData> students, int templateId) {
        // This is a placeholder for certificate generation logic
        // In a real implementation, this would:
        // 1. Load the selected template
        // 2. Generate certificates for eligible students
        // 3. Return a zip file containing all generated PDFs
        
        StringBuilder result = new StringBuilder();
        for (StudentData student : students) {
            if (student.isEligible()) {
                result.append("Generated certificate for ")
                      .append(student.getName())
                      .append(" with ")
                      .append(student.getPercentage())
                      .append("% using template ")
                      .append(templateId)
                      .append("\n");
            }
        }
        
        return result.toString().getBytes();
    }
}