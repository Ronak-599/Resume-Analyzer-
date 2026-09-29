package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.AtsMatchResult;
import com.jobportal.dto.StatusUpdateRequest;
import com.jobportal.entity.*;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final AtsEngineService atsEngineService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              ResumeRepository resumeRepository,
                              AtsEngineService atsEngineService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.atsEngineService = atsEngineService;
    }

    @Transactional
    public ApplicationResponse applyForJob(Long jobId, ApplicationRequest request, String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (candidate.getRole() != Role.CANDIDATE && candidate.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only candidates can apply for jobs");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.isActive()) {
            throw new BadRequestException("This job posting is no longer active");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), jobId)) {
            throw new BadRequestException("You have already applied for this position");
        }

        Resume resume = null;
        if (request != null && request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + request.getResumeId()));
        } else {
            // Find latest resume of candidate
            Optional<Resume> latestResume = resumeRepository.findTopByUserIdOrderByUploadDateDesc(candidate.getId());
            if (latestResume.isPresent()) {
                resume = latestResume.get();
            }
        }

        Double calculatedScore = null;
        if (resume != null && resume.getExtractedSkills() != null) {
            List<String> candidateSkills = Arrays.stream(resume.getExtractedSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            AtsMatchResult atsResult = atsEngineService.calculateMatch(candidateSkills, job.getRequiredSkills());
            calculatedScore = atsResult.getScore();
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setResume(resume);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setMatchScore(calculatedScore);
        if (request != null && request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        Application saved = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        return applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId()).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getJobApplications(Long jobId, String userEmail, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!job.getRecruiter().getId().equals(user.getId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have access to view applicants for this job");
        }

        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getRecruiterApplications(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return applicationRepository.findByRecruiterId(recruiter.getId()).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, StatusUpdateRequest request, String userEmail, boolean isAdmin) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!application.getJob().getRecruiter().getId().equals(user.getId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to update this application");
        }

        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        Application updated = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(updated);
    }
}
