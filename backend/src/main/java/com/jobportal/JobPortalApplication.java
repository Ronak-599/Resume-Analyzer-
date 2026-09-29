package com.jobportal;

import com.jobportal.entity.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.time.LocalDateTime;

@SpringBootApplication
public class JobPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobPortalApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository,
                                          JobRepository jobRepository,
                                          ResumeRepository resumeRepository,
                                          ApplicationRepository applicationRepository,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure uploads directory exists
            File uploadDir = new File("./uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Seed Admin if not exists
            if (!userRepository.existsByEmail("admin@jobportal.com")) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@jobportal.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setPhone("+1 (555) 019-2831");
                admin.setCompanyName("JobPortal HQ");
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            // Seed Recruiter if not exists
            User recruiter;
            if (!userRepository.existsByEmail("recruiter@techcorp.com")) {
                recruiter = new User();
                recruiter.setName("Sarah Jenkins");
                recruiter.setEmail("recruiter@techcorp.com");
                recruiter.setPassword(passwordEncoder.encode("recruiter123"));
                recruiter.setRole(Role.RECRUITER);
                recruiter.setPhone("+1 (555) 345-6789");
                recruiter.setCompanyName("TechCorp Innovations");
                recruiter.setEnabled(true);
                recruiter = userRepository.save(recruiter);
            } else {
                recruiter = userRepository.findByEmail("recruiter@techcorp.com").orElse(null);
            }

            // Seed Candidate if not exists
            User candidate;
            if (!userRepository.existsByEmail("ronak@example.com")) {
                candidate = new User();
                candidate.setName("Ronak Pawar");
                candidate.setEmail("ronak@example.com");
                candidate.setPassword(passwordEncoder.encode("candidate123"));
                candidate.setRole(Role.CANDIDATE);
                candidate.setPhone("+91 98765 43210");
                candidate.setEnabled(true);
                candidate = userRepository.save(candidate);

                // Seed Resume for Ronak
                Resume resume = new Resume();
                resume.setUser(candidate);
                resume.setFileName("ronak_pawar_resume.pdf");
                resume.setOriginalFileName("Ronak_Pawar_FullStack_Resume.pdf");
                resume.setFileType("application/pdf");
                resume.setFileSize(128450L);
                resume.setFilePath("./uploads/ronak_pawar_resume.pdf");
                resume.setExtractedName("Ronak Pawar");
                resume.setExtractedEmail("ronak@example.com");
                resume.setExtractedPhone("+91 98765 43210");
                resume.setExtractedSkills("Java, Spring Boot, React, MySQL, Hibernate, Git, REST API");
                resume.setExtractedEducation("Bachelor of Technology in Computer Science");
                resume.setRawText("Ronak Pawar\nSoftware Developer\nSkills: Java, Spring Boot, React, MySQL, Hibernate, Git, REST API\nEducation: B.Tech Computer Science");
                resume.setAtsScore(85.0);
                resumeRepository.save(resume);
            } else {
                candidate = userRepository.findByEmail("ronak@example.com").orElse(null);
            }

            // Seed Jobs if repository is empty
            if (jobRepository.count() == 0 && recruiter != null) {
                Job job1 = new Job();
                job1.setTitle("Java Full Stack Developer");
                job1.setDescription("We are seeking an experienced Java Full Stack Developer to build mission-critical enterprise applications. You will be designing robust REST APIs using Spring Boot, integrating with MySQL databases, and building modern, responsive interfaces using React.");
                job1.setCompany("TechCorp Innovations");
                job1.setLocation("San Francisco, CA (Hybrid)");
                job1.setSalary("$120,000 - $145,000 / yr");
                job1.setExperience("3 - 5 Years");
                job1.setRequiredSkills("Java, Spring Boot, React, MySQL, Docker, REST API");
                job1.setJobType(JobType.FULL_TIME);
                job1.setRecruiter(recruiter);
                job1.setActive(true);
                Job savedJob1 = jobRepository.save(job1);

                Job job2 = new Job();
                job2.setTitle("Senior Backend Engineer (Microservices)");
                job2.setDescription("Lead backend architecture for high-throughput distributed systems. You will develop event-driven microservices using Spring Boot, Apache Kafka, Redis caching, and Docker/Kubernetes container orchestration.");
                job2.setCompany("CloudScale Dynamics");
                job2.setLocation("Remote, US");
                job2.setSalary("$140,000 - $170,000 / yr");
                job2.setExperience("5+ Years");
                job2.setRequiredSkills("Java, Spring Boot, Microservices, Kafka, Redis, Docker, Kubernetes");
                job2.setJobType(JobType.REMOTE);
                job2.setRecruiter(recruiter);
                job2.setActive(true);
                jobRepository.save(job2);

                Job job3 = new Job();
                job3.setTitle("React & TypeScript Frontend Specialist");
                job3.setDescription("Create next-generation intuitive user interfaces for enterprise analytics and dashboard products. Deep experience with modern React 18, TypeScript, Tailwind CSS, state management, and API integrations.");
                job3.setCompany("Apex Digital Media");
                job3.setLocation("Austin, TX");
                job3.setSalary("$105,000 - $130,000 / yr");
                job3.setExperience("2 - 4 Years");
                job3.setRequiredSkills("React, TypeScript, JavaScript, HTML, CSS, Redux, Git");
                job3.setJobType(JobType.FULL_TIME);
                job3.setRecruiter(recruiter);
                job3.setActive(true);
                jobRepository.save(job3);

                Job job4 = new Job();
                job4.setTitle("DevOps & Cloud Platform Engineer");
                job4.setDescription("Maintain scalable cloud infrastructure on AWS and implement robust CI/CD pipelines. Work alongside Java backend teams to automate container deployments and enhance observability.");
                job4.setCompany("TechCorp Innovations");
                job4.setLocation("Remote");
                job4.setSalary("$130,000 - $160,000 / yr");
                job4.setExperience("4+ Years");
                job4.setRequiredSkills("Docker, Kubernetes, AWS, CI/CD, Jenkins, Linux, Python");
                job4.setJobType(JobType.REMOTE);
                job4.setRecruiter(recruiter);
                job4.setActive(true);
                jobRepository.save(job4);

                // Seed initial application for test demonstration
                if (candidate != null) {
                    Resume ronakResume = resumeRepository.findTopByUserIdOrderByUploadDateDesc(candidate.getId()).orElse(null);
                    Application app = new Application();
                    app.setCandidate(candidate);
                    app.setJob(savedJob1);
                    app.setResume(ronakResume);
                    app.setStatus(ApplicationStatus.SHORTLISTED);
                    app.setMatchScore(83.3);
                    app.setAppliedAt(LocalDateTime.now().minusDays(2));
                    app.setNotes("Candidate demonstrates strong Java 21 and React skills. Shortlisted for technical round.");
                    applicationRepository.save(app);
                }
            }
        };
    }
}
