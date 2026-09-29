package com.jobportal.controller;

import com.jobportal.dto.AtsMatchResult;
import com.jobportal.dto.ResumeResponse;
import com.jobportal.entity.Resume;
import com.jobportal.service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public ResponseEntity<ResumeResponse> uploadResume(@RequestParam("file") MultipartFile file,
                                                       Authentication authentication) throws IOException {
        return ResponseEntity.ok(resumeService.uploadResume(file, authentication.getName()));
    }

    @GetMapping("/my-resume")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public ResponseEntity<ResumeResponse> getMyResume(Authentication authentication) {
        ResumeResponse resume = resumeService.getLatestResume(authentication.getName());
        if (resume == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/ats-check/{jobId}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public ResponseEntity<AtsMatchResult> checkAtsScore(@PathVariable Long jobId,
                                                        Authentication authentication) {
        return ResponseEntity.ok(resumeService.checkAtsAgainstJob(jobId, authentication.getName()));
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN', 'CANDIDATE')")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        Resume resume = resumeService.getResumeEntity(id);
        Resource resource = resumeService.loadResumeAsResource(id);

        String filename = resume.getOriginalFileName() != null ? resume.getOriginalFileName() : resume.getFileName();
        String contentType = resume.getFileType() != null ? resume.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
