package com.premium.essai.repository;

import com.premium.essai.model.TemplateEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateEmailRepository extends JpaRepository<TemplateEmail, String> {
}