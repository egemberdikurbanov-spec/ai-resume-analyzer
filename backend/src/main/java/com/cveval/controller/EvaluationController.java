package com.cveval.controller;

import com.cveval.dto.EvaluationRequest;
import com.cveval.dto.EvaluationResponse;
import com.cveval.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<EvaluationResponse> create(
            @Valid @RequestBody EvaluationRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(evaluationService.create(request, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> list(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(evaluationService.listForUser(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> get(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(evaluationService.getById(id, user.getUsername()));
    }
}
