package com.cveval.service;

import com.cveval.dto.EvaluationRequest;
import com.cveval.dto.EvaluationResponse;
import com.cveval.model.Cv;
import com.cveval.model.Evaluation;
import com.cveval.model.User;
import com.cveval.repository.CvRepository;
import com.cveval.repository.EvaluationRepository;
import com.cveval.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final CvRepository cvRepository;
    private final UserRepository userRepository;
    private final AiStubService aiStubService;

    public EvaluationResponse create(EvaluationRequest request, String userEmail) {
        User user = findUser(userEmail);
        Cv cv = cvRepository.findByIdAndUserId(request.getCvId(), user.getId())
                .orElseThrow(() -> new NoSuchElementException("CV not found"));

        Evaluation evaluation = new Evaluation();
        evaluation.setUser(user);
        evaluation.setCv(cv);
        evaluation.setJobDescription(request.getJobDescription());
        evaluation.setStatus(Evaluation.Status.PENDING);
        evaluationRepository.save(evaluation);

        try {
            String cvText = readCvText(cv.getFilePath());
            String result = aiStubService.evaluate(cvText, request.getJobDescription());
            evaluation.setAiResult(result);
            evaluation.setStatus(Evaluation.Status.COMPLETED);
            evaluation.setCompletedAt(LocalDateTime.now());
        } catch (Exception e) {
            evaluation.setStatus(Evaluation.Status.FAILED);
            evaluation.setAiResult("{\"error\": \"" + e.getMessage() + "\"}");
        }

        evaluationRepository.save(evaluation);
        return toResponse(evaluation);
    }

    public List<EvaluationResponse> listForUser(String userEmail) {
        User user = findUser(userEmail);
        return evaluationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EvaluationResponse getById(Long id, String userEmail) {
        User user = findUser(userEmail);
        Evaluation evaluation = evaluationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new NoSuchElementException("Evaluation not found"));
        return toResponse(evaluation);
    }

    private String readCvText(String filePath) {
        try {
            return Files.readString(Paths.get(filePath));
        } catch (Exception e) {
            return "[binary PDF - text extraction handled by AI layer]";
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    private EvaluationResponse toResponse(Evaluation e) {
        EvaluationResponse r = new EvaluationResponse();
        r.setId(e.getId());
        r.setCvId(e.getCv().getId());
        r.setCvFilename(e.getCv().getOriginalFilename());
        r.setJobDescription(e.getJobDescription());
        r.setStatus(e.getStatus().name());
        r.setAiResult(e.getAiResult());
        r.setCreatedAt(e.getCreatedAt());
        r.setCompletedAt(e.getCompletedAt());
        return r;
    }
}
