package com.jobportal.dto;

import java.util.ArrayList;
import java.util.List;

public class RecruiterDashboardStats {

    private long jobsPosted;
    private long applicationsReceived;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private long rejectedCount;
    private List<ApplicationResponse> recentApplications = new ArrayList<>();

    public RecruiterDashboardStats() {}

    public long getJobsPosted() {
        return jobsPosted;
    }

    public void setJobsPosted(long jobsPosted) {
        this.jobsPosted = jobsPosted;
    }

    public long getApplicationsReceived() {
        return applicationsReceived;
    }

    public void setApplicationsReceived(long applicationsReceived) {
        this.applicationsReceived = applicationsReceived;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getInterviewCount() {
        return interviewCount;
    }

    public void setInterviewCount(long interviewCount) {
        this.interviewCount = interviewCount;
    }

    public long getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(long selectedCount) {
        this.selectedCount = selectedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public List<ApplicationResponse> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<ApplicationResponse> recentApplications) {
        this.recentApplications = recentApplications;
    }
}
