package com.cveval.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CvResponse {
    private Long id;
    private String originalFilename;
    private LocalDateTime uploadedAt;
}
