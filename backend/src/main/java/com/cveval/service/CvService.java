package com.cveval.service;

import com.cveval.dto.CvResponse;
import com.cveval.model.Cv;
import com.cveval.model.User;
import com.cveval.repository.CvRepository;
import com.cveval.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CvService {

    private final CvRepository cvRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public CvResponse upload(MultipartFile file, String userEmail) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are accepted");
        }

        User user = findUser(userEmail);

        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String storedFilename = UUID.randomUUID() + ".pdf";
        Path destination = uploadPath.resolve(storedFilename);
        Files.copy(file.getInputStream(), destination);

        Cv cv = new Cv();
        cv.setUser(user);
        cv.setOriginalFilename(file.getOriginalFilename());
        cv.setStoredFilename(storedFilename);
        cv.setFilePath(destination.toAbsolutePath().toString());
        cvRepository.save(cv);

        return toResponse(cv);
    }

    public List<CvResponse> listForUser(String userEmail) {
        User user = findUser(userEmail);
        return cvRepository.findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void delete(Long cvId, String userEmail) {
        User user = findUser(userEmail);
        Cv cv = cvRepository.findByIdAndUserId(cvId, user.getId())
                .orElseThrow(() -> new NoSuchElementException("CV not found"));

        try {
            Files.deleteIfExists(Paths.get(cv.getFilePath()));
        } catch (IOException ignored) {}

        cvRepository.delete(cv);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    private CvResponse toResponse(Cv cv) {
        CvResponse r = new CvResponse();
        r.setId(cv.getId());
        r.setOriginalFilename(cv.getOriginalFilename());
        r.setUploadedAt(cv.getUploadedAt());
        return r;
    }
}
