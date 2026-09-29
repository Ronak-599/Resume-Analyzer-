package com.jobportal.dto;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardStats {

    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;
    private List<UserSummaryDto> recentUsers = new ArrayList<>();
    private List<JobResponse> recentJobs = new ArrayList<>();

    public AdminDashboardStats() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public List<UserSummaryDto> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<UserSummaryDto> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<JobResponse> getRecentJobs() {
        return recentJobs;
    }

    public void setRecentJobs(List<JobResponse> recentJobs) {
        this.recentJobs = recentJobs;
    }
}
