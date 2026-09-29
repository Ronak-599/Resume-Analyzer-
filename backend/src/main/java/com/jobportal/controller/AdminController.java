package com.jobportal.controller;

import com.jobportal.dto.AdminDashboardStats;
import com.jobportal.dto.UserSummaryDto;
import com.jobportal.service.JobService;
import com.jobportal.service.StatsService;
import com.jobportal.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final JobService jobService;
    private final StatsService statsService;

    public AdminController(UserService userService, JobService jobService, StatsService statsService) {
        this.userService = userService;
        this.jobService = jobService;
        this.statsService = statsService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserSummaryDto> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getAdminStats() {
        return ResponseEntity.ok(statsService.getAdminStats());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(id, authentication.getName(), true);
        return ResponseEntity.noContent().build();
    }
}
