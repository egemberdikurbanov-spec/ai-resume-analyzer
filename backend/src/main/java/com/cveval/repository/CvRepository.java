package com.cveval.repository;

import com.cveval.model.Cv;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CvRepository extends JpaRepository<Cv, Long> {
    List<Cv> findByUserIdOrderByUploadedAtDesc(Long userId);
    Optional<Cv> findByIdAndUserId(Long id, Long userId);
}
