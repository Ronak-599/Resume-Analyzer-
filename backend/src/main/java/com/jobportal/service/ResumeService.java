package com.jobportal.service;

import com.jobportal.dto.AtsMatchResult;
import com.jobportal.dto.ResumeResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ResumeParserService resumeParserService;
    private final AtsEngineService atsEngineService;

    public ResumeService(ResumeRepository resumeRepository,
                         UserRepository userRepository,
                         JobRepository jobRepository,
                         ResumeParserService resumeParserService,
                         AtsEngineService atsEngineService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.resumeParserService = resumeParserService;
        this.atsEngineService = atsEngineService;
    }

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file, String userEmail) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded resume file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "resume.pdf";
        }

        String lower = originalFilename.toLowerCase();
        if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".txt")) {
            throw new BadRequestException("Only PDF, DOCX, and TXT files are accepted for resume upload");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String storedFileName = UUID.randomUUID() + "_" + originalFilename.replaceAll("\\s+", "_");
        Path destination = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // Parse resume
        byte[] bytes = file.getBytes();
        String extractedText = resumeParserService.extractText(bytes, originalFilename);
        String name = resumeParserService.extractName(extractedText);
        String email = resumeParserService.extractEmail(extractedText);
        String phone = resumeParserService.extractPhone(extractedText);
        List<String> skills = resumeParserService.extractSkills(extractedText);
        String education = resumeParserService.extractEducation(extractedText);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(storedFileName);
        resume.setOriginalFileName(originalFilename);
        resume.setFileType(file.getContentType());
        resume.setFileSize(file.getSize());
        resume.setFilePath(destination.toString());
        resume.setRawText(extractedText.length() > 9500 ? extractedText.substring(0, 9500) : extractedText);
        resume.setExtractedName(name != null ? name : user.getName());
        resume.setExtractedEmail(email != null ? email : user.getEmail());
        resume.setExtractedPhone(phone != null ? phone : user.getPhone());
        resume.setExtractedSkills(String.join(", ", skills));
        resume.setExtractedEducation(education);

        // Calculate baseline score based on skill breadth (10 skills = 80+)
        double baselineScore = Math.min(100.0, Math.round(skills.size() * 9.5));
        resume.setAtsScore(baselineScore);

        Resume saved = resumeRepository.save(resume);
        return ResumeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ResumeResponse getLatestResume(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return resumeRepository.findTopByUserIdOrderByUploadDateDesc(user.getId())
                .map(ResumeResponse::fromEntity)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public AtsMatchResult checkAtsAgainstJob(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        Resume resume = resumeRepository.findTopByUserIdOrderByUploadDateDesc(user.getId())
                .orElseThrow(() -> new BadRequestException("Please upload your resume first to run the ATS Analyzer"));

        List<String> candidateSkills = resume.getExtractedSkills() != null ?
                Arrays.stream(resume.getExtractedSkills().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList()) :
                List.of();

        return atsEngineService.calculateMatch(candidateSkills, job.getRequiredSkills());
    }

    @Transactional(readOnly = true)
    public Resource loadResumeAsResource(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        try {
            Path filePath = Paths.get(resume.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found on disk");
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File path is invalid: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Resume getResumeEntity(Long resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));
    }
}
