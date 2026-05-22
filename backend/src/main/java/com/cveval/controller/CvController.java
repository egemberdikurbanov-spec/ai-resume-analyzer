package com.cveval.controller;

import com.cveval.dto.CvResponse;
import com.cveval.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cvs")
@RequiredArgsConstructor
public class CvController {

    private final CvService cvService;

    @PostMapping
    public ResponseEntity<CvResponse> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails user) throws IOException {
        return ResponseEntity.ok(cvService.upload(file, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<CvResponse>> list(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cvService.listForUser(user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        cvService.delete(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
