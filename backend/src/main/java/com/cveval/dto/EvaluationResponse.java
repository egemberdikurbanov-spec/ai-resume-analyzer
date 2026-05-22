package com.cveval.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EvaluationResponse {
    private Long id;
    private Long cvId;
    private String cvFilename;
    private String jobDescription;
    private String status;
    private String aiResult;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
