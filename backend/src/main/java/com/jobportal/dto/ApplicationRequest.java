package com.jobportal.dto;

public class ApplicationRequest {

    private Long resumeId;
    private String notes;

    public ApplicationRequest() {}

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
