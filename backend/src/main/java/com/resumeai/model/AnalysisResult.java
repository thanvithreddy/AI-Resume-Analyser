package com.resumeai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_results")
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String resumeFileName;

    @Column(columnDefinition = "TEXT")
    private String originalResumeText;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private Integer overallScore;
    private Integer atsScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer formattingScore;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(columnDefinition = "TEXT")
    private String experienceFeedback;

    @Column(columnDefinition = "TEXT")
    private String skillsFeedback;

    @Column(columnDefinition = "TEXT")
    private String topIssues;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(columnDefinition = "TEXT")
    private String rewrittenResume;

    private LocalDateTime createdAt = LocalDateTime.now();

    public AnalysisResult() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }
    public String getOriginalResumeText() { return originalResumeText; }
    public void setOriginalResumeText(String originalResumeText) { this.originalResumeText = originalResumeText; }
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }
    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer skillsScore) { this.skillsScore = skillsScore; }
    public Integer getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Integer experienceScore) { this.experienceScore = experienceScore; }
    public Integer getFormattingScore() { return formattingScore; }
    public void setFormattingScore(Integer formattingScore) { this.formattingScore = formattingScore; }
    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }
    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }
    public String getExperienceFeedback() { return experienceFeedback; }
    public void setExperienceFeedback(String experienceFeedback) { this.experienceFeedback = experienceFeedback; }
    public String getSkillsFeedback() { return skillsFeedback; }
    public void setSkillsFeedback(String skillsFeedback) { this.skillsFeedback = skillsFeedback; }
    public String getTopIssues() { return topIssues; }
    public void setTopIssues(String topIssues) { this.topIssues = topIssues; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
    public String getRewrittenResume() { return rewrittenResume; }
    public void setRewrittenResume(String rewrittenResume) { this.rewrittenResume = rewrittenResume; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AnalysisResult r = new AnalysisResult();
        public Builder user(User v) { r.user = v; return this; }
        public Builder resumeFileName(String v) { r.resumeFileName = v; return this; }
        public Builder originalResumeText(String v) { r.originalResumeText = v; return this; }
        public Builder jobDescription(String v) { r.jobDescription = v; return this; }
        public Builder overallScore(Integer v) { r.overallScore = v; return this; }
        public Builder atsScore(Integer v) { r.atsScore = v; return this; }
        public Builder skillsScore(Integer v) { r.skillsScore = v; return this; }
        public Builder experienceScore(Integer v) { r.experienceScore = v; return this; }
        public Builder formattingScore(Integer v) { r.formattingScore = v; return this; }
        public Builder matchedSkills(String v) { r.matchedSkills = v; return this; }
        public Builder missingSkills(String v) { r.missingSkills = v; return this; }
        public Builder summaryFeedback(String v) { r.summaryFeedback = v; return this; }
        public Builder experienceFeedback(String v) { r.experienceFeedback = v; return this; }
        public Builder skillsFeedback(String v) { r.skillsFeedback = v; return this; }
        public Builder topIssues(String v) { r.topIssues = v; return this; }
        public Builder suggestions(String v) { r.suggestions = v; return this; }
        public Builder rewrittenResume(String v) { r.rewrittenResume = v; return this; }
        public AnalysisResult build() { return r; }
    }
}
