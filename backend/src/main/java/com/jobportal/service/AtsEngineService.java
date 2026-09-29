package com.jobportal.service;

import com.jobportal.dto.AtsMatchResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AtsEngineService {

    private static final Map<String, String> SKILL_SYNONYMS = new HashMap<>();

    static {
        SKILL_SYNONYMS.put("springboot", "spring boot");
        SKILL_SYNONYMS.put("reactjs", "react");
        SKILL_SYNONYMS.put("react.js", "react");
        SKILL_SYNONYMS.put("nodejs", "node.js");
        SKILL_SYNONYMS.put("angularjs", "angular");
        SKILL_SYNONYMS.put("postgres", "postgresql");
        SKILL_SYNONYMS.put("k8s", "kubernetes");
        SKILL_SYNONYMS.put("js", "javascript");
        SKILL_SYNONYMS.put("ts", "typescript");
        SKILL_SYNONYMS.put("amazon web services", "aws");
    }

    public AtsMatchResult calculateMatch(List<String> candidateSkills, String requiredSkillsRaw) {
        AtsMatchResult result = new AtsMatchResult();

        if (requiredSkillsRaw == null || requiredSkillsRaw.isBlank()) {
            result.setScore(100.0);
            result.setMatchLevel("Excellent Match");
            result.setFeedbackSummary("No strict skill prerequisites listed for this role.");
            return result;
        }

        List<String> requiredSkills = Arrays.stream(requiredSkillsRaw.split("[,;\\n]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        result.setRequiredSkills(requiredSkills);
        result.setCandidateSkills(candidateSkills != null ? candidateSkills : Collections.emptyList());
        result.setTotalRequired(requiredSkills.size());

        if (requiredSkills.isEmpty()) {
            result.setScore(100.0);
            result.setMatchLevel("Excellent Match");
            result.setFeedbackSummary("All open requirements matched!");
            return result;
        }

        Set<String> normalizedCandidateSkills = (candidateSkills == null ? Collections.<String>emptyList() : candidateSkills)
                .stream()
                .map(this::normalizeSkill)
                .collect(Collectors.toSet());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredSkills) {
            String normReq = normalizeSkill(req);
            boolean isMatched = normalizedCandidateSkills.contains(normReq) ||
                    normalizedCandidateSkills.stream().anyMatch(cand -> cand.contains(normReq) || normReq.contains(cand));

            if (isMatched) {
                matched.add(req);
            } else {
                missing.add(req);
            }
        }

        result.setMatchedSkills(matched);
        result.setMissingSkills(missing);
        result.setTotalMatched(matched.size());

        // Formula: Matched Skills / Required Skills * 100
        double rawScore = ((double) matched.size() / requiredSkills.size()) * 100.0;
        double roundedScore = Math.round(rawScore * 10.0) / 10.0;
        result.setScore(roundedScore);

        // ATS Scoring Logic
        if (roundedScore > 80.0) {
            result.setMatchLevel("Excellent Match");
            result.setFeedbackSummary("Your resume is an exceptional match for this position! High probability of shortlisting.");
        } else if (roundedScore >= 60.0) {
            result.setMatchLevel("Good Match");
            result.setFeedbackSummary("Solid alignment with the job requirements. Minor skill gaps can be addressed in the interview.");
        } else if (roundedScore >= 40.0) {
            result.setMatchLevel("Average Match");
            result.setFeedbackSummary("Moderate match. We recommend highlighting hands-on projects with the missing skills.");
        } else {
            result.setMatchLevel("Poor Match");
            result.setFeedbackSummary("Low skill alignment. Consider acquiring the essential required technologies before applying.");
        }

        // Generate tailored recommendations
        List<String> recommendations = new ArrayList<>();
        if (!missing.isEmpty()) {
            recommendations.add("Consider incorporating the following missing technologies: " + String.join(", ", missing));
        }
        if (roundedScore < 60.0) {
            recommendations.add("Tailor your project descriptions to emphasize practical experience with " + (missing.isEmpty() ? "job prerequisites" : missing.get(0)));
            recommendations.add("Ensure your resume contains exact industry keywords matching recruiter job descriptions.");
        } else {
            recommendations.add("Your core skillset matches the target position closely. Ready to submit application!");
        }
        result.setRecommendations(recommendations);

        return result;
    }

    private String normalizeSkill(String skill) {
        if (skill == null) return "";
        String cleaned = skill.trim().toLowerCase().replaceAll("[^a-z0-9#+.]", "");
        return SKILL_SYNONYMS.getOrDefault(cleaned, cleaned);
    }
}
