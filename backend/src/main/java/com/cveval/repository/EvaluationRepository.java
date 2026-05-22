package com.cveval.repository;

import com.cveval.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Evaluation> findByIdAndUserId(Long id, Long userId);
}
