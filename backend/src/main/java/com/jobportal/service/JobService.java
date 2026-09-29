package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public JobResponse createJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only recruiters and admins can post jobs");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setJobType(request.getJobType());
        job.setRecruiter(recruiter);
        job.setActive(true);

        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved, 0);
    }

    @Transactional
    public JobResponse updateJob(Long jobId, JobRequest request, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!job.getRecruiter().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You do not have permission to modify this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setJobType(request.getJobType());

        Job updated = jobRepository.save(job);
        int applicantCount = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId).size();
        return JobResponse.fromEntity(updated, applicantCount);
    }

    @Transactional
    public void deleteJob(Long jobId, String userEmail, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!job.getRecruiter().getId().equals(user.getId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to delete this job");
        }

        jobRepository.delete(job);
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        int applicantCount = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId).size();
        return JobResponse.fromEntity(job, applicantCount);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {
        return jobRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(job -> {
                    int applicantCount = applicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size();
                    return JobResponse.fromEntity(job, applicantCount);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String query, String location, String experience) {
        String q = (query != null && !query.isBlank()) ? query.trim() : "";
        String loc = (location != null && !location.isBlank()) ? location.trim() : "";
        String exp = (experience != null && !experience.isBlank()) ? experience.trim() : "";

        return jobRepository.searchJobs(q, loc, exp).stream()
                .map(job -> {
                    int applicantCount = applicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size();
                    return JobResponse.fromEntity(job, applicantCount);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getRecruiterJobs(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return jobRepository.findByRecruiterOrderByCreatedAtDesc(recruiter).stream()
                .map(job -> {
                    int applicantCount = applicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size();
                    return JobResponse.fromEntity(job, applicantCount);
                })
                .collect(Collectors.toList());
    }
}
