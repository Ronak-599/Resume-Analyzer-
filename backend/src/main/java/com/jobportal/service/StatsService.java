package com.jobportal.service;

import com.jobportal.dto.AdminDashboardStats;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.JobResponse;
import com.jobportal.dto.RecruiterDashboardStats;
import com.jobportal.dto.UserSummaryDto;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public StatsService(JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public RecruiterDashboardStats getRecruiterStats(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        RecruiterDashboardStats stats = new RecruiterDashboardStats();
        stats.setJobsPosted(jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId()).size());
        stats.setApplicationsReceived(applicationRepository.countByJobRecruiterId(recruiter.getId()));
        stats.setShortlistedCount(applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.SHORTLISTED));
        stats.setInterviewCount(applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.INTERVIEW));
        stats.setSelectedCount(applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.SELECTED));
        stats.setRejectedCount(applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.REJECTED));

        List<ApplicationResponse> recent = applicationRepository.findByRecruiterId(recruiter.getId()).stream()
                .limit(5)
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentApplications(recent);

        return stats;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStats getAdminStats() {
        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCandidates(userRepository.countByRole(Role.CANDIDATE));
        stats.setTotalRecruiters(userRepository.countByRole(Role.RECRUITER));
        stats.setTotalJobs(jobRepository.count());
        stats.setTotalApplications(applicationRepository.count());

        List<UserSummaryDto> recentUsers = userRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentUsers(recentUsers);

        List<JobResponse> recentJobs = jobRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(job -> {
                    int count = applicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size();
                    return JobResponse.fromEntity(job, count);
                })
                .collect(Collectors.toList());
        stats.setRecentJobs(recentJobs);

        return stats;
    }
}
