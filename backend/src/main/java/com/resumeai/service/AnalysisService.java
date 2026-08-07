package com.resumeai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.dto.AnalysisResponse;
import com.resumeai.model.AnalysisResult;
import com.resumeai.model.User;
import com.resumeai.repository.AnalysisResultRepository;
import com.resumeai.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@Service
public class AnalysisService {
    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final ResumeParserService resumeParserService;
    private final GeminiService geminiService;
    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AnalysisService(ResumeParserService resumeParserService,
                           GeminiService geminiService,
                           AnalysisResultRepository analysisResultRepository,
                           UserRepository userRepository,
                           ObjectMapper objectMapper) {
        this.resumeParserService = resumeParserService;
        this.geminiService = geminiService;
        this.analysisResultRepository = analysisResultRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public AnalysisResponse analyzeResume(MultipartFile resumeFile, String jobDescription) throws Exception {
        User user = getCurrentUser();
        String resumeText = resumeParserService.extractText(resumeFile);
        String analysisJson = callGeminiForAnalysis(resumeText, jobDescription);
        String rewrittenResume = callGeminiForRewrite(resumeText, jobDescription);
        AnalysisResult result = parseAndSaveResult(user, resumeFile.getOriginalFilename(), resumeText, jobDescription, analysisJson, rewrittenResume);
        return buildResponse(result);
    }

    private String callGeminiForAnalysis(String resumeText, String jobDescription) {
        String prompt = """
                You are an expert ATS resume analyzer and career coach.
                Analyze this resume against the job description and return ONLY valid JSON (no markdown, no code blocks).
                
                Resume:
                %s
                
                Job Description:
                %s
                
                Return this exact JSON structure:
                {
                  "overallScore": <0-100>,
                  "atsScore": <0-100>,
                  "skillsScore": <0-100>,
                  "experienceScore": <0-100>,
                  "formattingScore": <0-100>,
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": ["skill1", "skill2"],
                  "summaryFeedback": {
                    "score": <0-10>,
                    "feedback": "specific feedback here",
                    "improved": "improved version here"
                  },
                  "experienceFeedback": {
                    "score": <0-10>,
                    "feedback": "specific feedback here",
                    "improved": "improved bullet points here"
                  },
                  "skillsFeedback": {
                    "score": <0-10>,
                    "feedback": "specific feedback here",
                    "improved": "reorganized skills section"
                  },
                  "topIssues": ["issue1", "issue2", "issue3"],
                  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
                }
                """.formatted(resumeText, jobDescription);
        String raw = geminiService.generateContent(prompt);
        raw = raw.trim();
        if (raw.startsWith("```")) {
            raw = raw.replaceAll("```json", "").replaceAll("```", "").trim();
        }
        return raw;
    }

    private String callGeminiForRewrite(String resumeText, String jobDescription) {
        String prompt = """
                You are an expert resume writer and career coach.
                Completely rewrite and enhance this resume to perfectly match the job description.
                Make it ATS-optimized, professional, and compelling.
                
                Original Resume:
                %s
                
                Target Job Description:
                %s
                
                Rules:
                1. Keep all true facts but rewrite them powerfully
                2. Add relevant keywords from the JD naturally
                3. Use strong action verbs (Led, Achieved, Delivered, Optimized)
                4. Quantify achievements wherever possible
                5. Format cleanly with clear sections
                6. Make the summary compelling and role-specific
                7. Reorganize skills to match JD priorities
                
                Return ONLY the complete rewritten resume text, no explanations.
                """.formatted(resumeText, jobDescription);
        return geminiService.generateContent(prompt);
    }

    private AnalysisResult parseAndSaveResult(User user, String fileName, String resumeText,
                                               String jobDescription, String analysisJson, String rewrittenResume) {
        try {
            JsonNode json = objectMapper.readTree(analysisJson);
            AnalysisResult result = AnalysisResult.builder()
                    .user(user)
                    .resumeFileName(fileName)
                    .originalResumeText(resumeText)
                    .jobDescription(jobDescription)
                    .overallScore(json.path("overallScore").asInt(0))
                    .atsScore(json.path("atsScore").asInt(0))
                    .skillsScore(json.path("skillsScore").asInt(0))
                    .experienceScore(json.path("experienceScore").asInt(0))
                    .formattingScore(json.path("formattingScore").asInt(0))
                    .matchedSkills(json.path("matchedSkills").toString())
                    .missingSkills(json.path("missingSkills").toString())
                    .summaryFeedback(json.path("summaryFeedback").toString())
                    .experienceFeedback(json.path("experienceFeedback").toString())
                    .skillsFeedback(json.path("skillsFeedback").toString())
                    .topIssues(json.path("topIssues").toString())
                    .suggestions(json.path("suggestions").toString())
                    .rewrittenResume(rewrittenResume)
                    .build();
            return analysisResultRepository.save(result);
        } catch (Exception e) {
            log.error("Error parsing analysis result: {}", e.getMessage());
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage());
        }
    }

    public AnalysisResponse buildResponse(AnalysisResult result) {
        try {
            List<String> matchedSkills = parseJsonArray(result.getMatchedSkills());
            List<String> missingSkills = parseJsonArray(result.getMissingSkills());
            List<String> topIssues = parseJsonArray(result.getTopIssues());
            List<String> suggestions = parseJsonArray(result.getSuggestions());
            AnalysisResponse.SectionFeedback summaryFb = parseSectionFeedback(result.getSummaryFeedback());
            AnalysisResponse.SectionFeedback expFb = parseSectionFeedback(result.getExperienceFeedback());
            AnalysisResponse.SectionFeedback skillsFb = parseSectionFeedback(result.getSkillsFeedback());
            return AnalysisResponse.builder()
                    .id(result.getId())
                    .resumeFileName(result.getResumeFileName())
                    .overallScore(result.getOverallScore())
                    .atsScore(result.getAtsScore())
                    .skillsScore(result.getSkillsScore())
                    .experienceScore(result.getExperienceScore())
                    .formattingScore(result.getFormattingScore())
                    .matchedSkills(matchedSkills)
                    .missingSkills(missingSkills)
                    .summaryFeedback(summaryFb)
                    .experienceFeedback(expFb)
                    .skillsFeedback(skillsFb)
                    .topIssues(topIssues)
                    .suggestions(suggestions)
                    .rewrittenResume(result.getRewrittenResume())
                    .createdAt(result.getCreatedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to build response: " + e.getMessage());
        }
    }

    private List<String> parseJsonArray(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            JsonNode node = objectMapper.readTree(json);
            List<String> list = new ArrayList<>();
            if (node.isArray()) node.forEach(n -> list.add(n.asText()));
            return list;
        } catch (Exception e) {
            return List.of();
        }
    }

    private AnalysisResponse.SectionFeedback parseSectionFeedback(String json) {
        try {
            if (json == null || json.isBlank()) return new AnalysisResponse.SectionFeedback();
            JsonNode node = objectMapper.readTree(json);
            return AnalysisResponse.SectionFeedback.builder()
                    .score(node.path("score").asInt(0))
                    .feedback(node.path("feedback").asText(""))
                    .improved(node.path("improved").asText(""))
                    .build();
        } catch (Exception e) {
            return new AnalysisResponse.SectionFeedback();
        }
    }

    public List<AnalysisResponse> getUserHistory() {
        User user = getCurrentUser();
        return analysisResultRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::buildResponse).toList();
    }

    public AnalysisResponse getAnalysisById(Long id) {
        User user = getCurrentUser();
        AnalysisResult result = analysisResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
        if (!result.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return buildResponse(result);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
