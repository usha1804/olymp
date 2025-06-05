package com.example.demo.Service;

import com.example.demo.model.Exam;
import com.example.demo.Repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam saveExam(Exam exam) {
        return examRepository.save(exam);
    }
    public void deleteExam(UUID id) {
        examRepository.deleteById(id);
    }
    
}
