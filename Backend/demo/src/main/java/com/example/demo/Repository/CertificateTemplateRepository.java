package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.CertificateTemplate;

public interface CertificateTemplateRepository extends JpaRepository<CertificateTemplate, Long>{

}
