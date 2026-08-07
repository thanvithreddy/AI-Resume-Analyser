package com.resumeai.repository;

import com.resumeai.model.AnalysisResult;
import com.resumeai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    List<AnalysisResult> findByUserOrderByCreatedAtDesc(User user);
    long countByUser(User user);
}
