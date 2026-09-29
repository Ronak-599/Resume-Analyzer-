package com.jobportal.controller;

import com.jobportal.dto.RecruiterDashboardStats;
import com.jobportal.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<RecruiterDashboardStats> getRecruiterStats(Authentication authentication) {
        return ResponseEntity.ok(statsService.getRecruiterStats(authentication.getName()));
    }
}
