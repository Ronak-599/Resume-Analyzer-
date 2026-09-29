package com.jobportal.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeParserService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeParserService.class);

    // Comprehensive industry skill dictionary
    private static final List<String> KNOWN_SKILLS = List.of(
            "Java", "Spring Boot", "Spring MVC", "Spring Security", "Spring Data JPA", "Hibernate", "JPA",
            "Microservices", "REST API", "GraphQL", "SOAP", "MySQL", "PostgreSQL", "Oracle", "MongoDB",
            "Redis", "Kafka", "RabbitMQ", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "React",
            "React.js", "Redux", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js", "TypeScript",
            "JavaScript", "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "Git", "GitHub",
            "GitLab", "CI/CD", "Jenkins", "Maven", "Gradle", "JUnit", "Mockito", "Selenium", "Python",
            "Django", "Flask", "C++", "C#", ".NET", "Linux", "Bash", "Shell Scripting", "Agile",
            "Scrum", "Jira", "Figma", "Elasticsearch", "Logstash", "Kibana", "Postman", "Swagger",
            "OpenAPI", "JSON", "XML", "JDBC", "Servlet", "Design Patterns", "Data Structures",
            "Algorithms", "Problem Solving", "WebSockets", "TensorFlow", "PyTorch", "Machine Learning"
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:(?:\\+|00)(\\d{1,3})[\\s-]?)?(?:\\(?(\\d{3})\\)?[\\s-]?)?(\\d{3})[\\s-](\\d{4})|(\\d{10})"
    );

    private static final List<String> EDUCATION_KEYWORDS = List.of(
            "Bachelor of Technology", "B.Tech", "B.E.", "Bachelor of Engineering",
            "Master of Technology", "M.Tech", "MCA", "Master of Computer Applications",
            "BCA", "Bachelor of Computer Applications", "B.Sc", "Bachelor of Science",
            "M.Sc", "Master of Science", "Ph.D", "Master of Business Administration", "MBA",
            "Computer Science", "Information Technology", "Electronics"
    );

    public String extractText(byte[] fileBytes, String originalFileName) throws IOException {
        String fileNameLower = (originalFileName != null) ? originalFileName.toLowerCase() : "";

        if (fileNameLower.endsWith(".pdf")) {
            return extractTextFromPdf(fileBytes);
        } else if (fileNameLower.endsWith(".docx")) {
            return extractTextFromDocx(fileBytes);
        } else if (fileNameLower.endsWith(".txt")) {
            return new String(fileBytes);
        } else {
            // Attempt PDF first, then plain text
            try {
                return extractTextFromPdf(fileBytes);
            } catch (Exception e) {
                return new String(fileBytes);
            }
        }
    }

    private String extractTextFromPdf(byte[] fileBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(byte[] fileBytes) throws IOException {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(fileBytes);
             XWPFDocument document = new XWPFDocument(bais);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    public String extractEmail(String text) {
        if (text == null) return null;
        Matcher matcher = EMAIL_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    public String extractPhone(String text) {
        if (text == null) return null;
        Matcher matcher = PHONE_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group().trim();
        }
        return null;
    }

    public String extractName(String text) {
        if (text == null || text.isBlank()) return null;

        String[] lines = text.split("\\r?\\n");
        for (String rawLine : lines) {
            String line = rawLine.trim();
            if (line.isEmpty() || line.length() < 3 || line.length() > 50) continue;
            // Skip lines with email or phone or links
            if (line.contains("@") || line.contains("http") || line.matches(".*\\d{5,}.*")) continue;
            // Skip header markers
            String lower = line.toLowerCase();
            if (lower.startsWith("curriculum") || lower.startsWith("resume") || lower.startsWith("cv") || lower.startsWith("page")) {
                continue;
            }
            // Check if line looks like a person's name (letters and spaces)
            if (line.matches("^[A-Za-z\\s.'-]+$")) {
                return line;
            }
        }
        return null;
    }

    public List<String> extractSkills(String text) {
        if (text == null || text.isBlank()) return Collections.emptyList();

        Set<String> matchedSkills = new LinkedHashSet<>();
        String normalizedText = text.toLowerCase();

        for (String skill : KNOWN_SKILLS) {
            String skillLower = skill.toLowerCase();
            // Word boundary regex check
            String patternString = "\\b" + Pattern.quote(skillLower) + "\\b";
            Pattern pattern = Pattern.compile(patternString);
            if (pattern.matcher(normalizedText).find()) {
                matchedSkills.add(skill);
            }
        }

        return new ArrayList<>(matchedSkills);
    }

    public String extractEducation(String text) {
        if (text == null || text.isBlank()) return null;

        List<String> matchedEducation = new ArrayList<>();
        String normalizedText = text.toLowerCase();

        for (String edu : EDUCATION_KEYWORDS) {
            if (normalizedText.contains(edu.toLowerCase())) {
                matchedEducation.add(edu);
            }
        }

        if (matchedEducation.isEmpty()) {
            return "Higher Education Degree";
        }
        return String.join(", ", matchedEducation);
    }
}
