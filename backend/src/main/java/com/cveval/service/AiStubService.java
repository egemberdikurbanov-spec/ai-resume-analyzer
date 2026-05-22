package com.cveval.service;

import org.springframework.stereotype.Service;

@Service
public class AiStubService {

    public String evaluate(String cvText, String jobDescription) {
        // TODO: AI team replaces this stub with real AI API call
        return """
                {
                  "matchScore": 72,
                  "summary": "The candidate has a solid technical background with relevant experience in the required domain. However, some gaps exist in the specific tools mentioned in the job description.",
                  "strengths": [
                    "Strong software engineering fundamentals",
                    "Relevant industry experience",
                    "Good communication skills evident from CV structure"
                  ],
                  "gaps": [
                    "No mention of required certification",
                    "Limited experience with the specific tech stack listed"
                  ],
                  "recommendation": "Shortlist for interview"
                }
                """;
    }
}
