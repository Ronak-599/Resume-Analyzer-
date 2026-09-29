package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrueOrderByCreatedAtDesc();

    List<Job> findByRecruiterOrderByCreatedAtDesc(User recruiter);

    List<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    @Query("SELECT j FROM Job j WHERE j.active = true AND (" +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:experience IS NULL OR :experience = '' OR LOWER(j.experience) LIKE LOWER(CONCAT('%', :experience, '%'))) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(@Param("query") String query,
                         @Param("location") String location,
                         @Param("experience") String experience);

    long countByActiveTrue();
}
