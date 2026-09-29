package com.jobportal.dto;

import com.jobportal.entity.Resume;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ResumeResponse {

    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private String extractedName;
    private String extractedEmail;
    private String extractedPhone;
    private String extractedSkills;
    private List<String> skillList = new ArrayList<>();
    private String extractedEducation;
    private Double atsScore;

    public ResumeResponse() {}

    public static ResumeResponse fromEntity(Resume resume) {
        ResumeResponse res = new ResumeResponse();
        res.setId(resume.getId());
        res.setFileName(resume.getFileName());
        res.setOriginalFileName(resume.getOriginalFileName());
        res.setFileType(resume.getFileType());
        res.setFileSize(resume.getFileSize());
        res.setUploadDate(resume.getUploadDate());
        res.setExtractedName(resume.getExtractedName());
        res.setExtractedEmail(resume.getExtractedEmail());
        res.setExtractedPhone(resume.getExtractedPhone());
        res.setExtractedSkills(resume.getExtractedSkills());
        if (resume.getExtractedSkills() != null && !resume.getExtractedSkills().isBlank()) {
            res.setSkillList(Arrays.stream(resume.getExtractedSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList());
        }
        res.setExtractedEducation(resume.getExtractedEducation());
        res.setAtsScore(resume.getAtsScore());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getExtractedName() {
        return extractedName;
    }

    public void setExtractedName(String extractedName) {
        this.extractedName = extractedName;
    }

    public String getExtractedEmail() {
        return extractedEmail;
    }

    public void setExtractedEmail(String extractedEmail) {
        this.extractedEmail = extractedEmail;
    }

    public String getExtractedPhone() {
        return extractedPhone;
    }

    public void setExtractedPhone(String extractedPhone) {
        this.extractedPhone = extractedPhone;
    }

    public String getExtractedSkills() {
        return extractedSkills;
    }

    public void setExtractedSkills(String extractedSkills) {
        this.extractedSkills = extractedSkills;
    }

    public List<String> getSkillList() {
        return skillList;
    }

    public void setSkillList(List<String> skillList) {
        this.skillList = skillList;
    }

    public String getExtractedEducation() {
        return extractedEducation;
    }

    public void setExtractedEducation(String extractedEducation) {
        this.extractedEducation = extractedEducation;
    }

    public Double getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Double atsScore) {
        this.atsScore = atsScore;
    }
}
