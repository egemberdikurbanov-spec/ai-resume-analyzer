package com.cveval.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluationRequest {
    @NotNull(message = "CV ID is required")
    private Long cvId;

    @NotBlank(message = "Job description is required")
    private String jobDescription;
}
