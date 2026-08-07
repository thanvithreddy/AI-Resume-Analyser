package com.resumeai.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AnalysisResponse {
    private Long id;
    private String resumeFileName;
    private Integer overallScore;
    private Integer atsScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer formattingScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private SectionFeedback summaryFeedback;
    private SectionFeedback experienceFeedback;
    private SectionFeedback skillsFeedback;
    private List<String> topIssues;
    private List<String> suggestions;
    private String rewrittenResume;
    private LocalDateTime createdAt;

    public AnalysisResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }
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
    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
    public SectionFeedback getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(SectionFeedback summaryFeedback) { this.summaryFeedback = summaryFeedback; }
    public SectionFeedback getExperienceFeedback() { return experienceFeedback; }
    public void setExperienceFeedback(SectionFeedback experienceFeedback) { this.experienceFeedback = experienceFeedback; }
    public SectionFeedback getSkillsFeedback() { return skillsFeedback; }
    public void setSkillsFeedback(SectionFeedback skillsFeedback) { this.skillsFeedback = skillsFeedback; }
    public List<String> getTopIssues() { return topIssues; }
    public void setTopIssues(List<String> topIssues) { this.topIssues = topIssues; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public String getRewrittenResume() { return rewrittenResume; }
    public void setRewrittenResume(String rewrittenResume) { this.rewrittenResume = rewrittenResume; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AnalysisResponse r = new AnalysisResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder resumeFileName(String v) { r.resumeFileName = v; return this; }
        public Builder overallScore(Integer v) { r.overallScore = v; return this; }
        public Builder atsScore(Integer v) { r.atsScore = v; return this; }
        public Builder skillsScore(Integer v) { r.skillsScore = v; return this; }
        public Builder experienceScore(Integer v) { r.experienceScore = v; return this; }
        public Builder formattingScore(Integer v) { r.formattingScore = v; return this; }
        public Builder matchedSkills(List<String> v) { r.matchedSkills = v; return this; }
        public Builder missingSkills(List<String> v) { r.missingSkills = v; return this; }
        public Builder summaryFeedback(SectionFeedback v) { r.summaryFeedback = v; return this; }
        public Builder experienceFeedback(SectionFeedback v) { r.experienceFeedback = v; return this; }
        public Builder skillsFeedback(SectionFeedback v) { r.skillsFeedback = v; return this; }
        public Builder topIssues(List<String> v) { r.topIssues = v; return this; }
        public Builder suggestions(List<String> v) { r.suggestions = v; return this; }
        public Builder rewrittenResume(String v) { r.rewrittenResume = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public AnalysisResponse build() { return r; }
    }

    public static class SectionFeedback {
        private Integer score;
        private String feedback;
        private String improved;

        public SectionFeedback() {}
        public SectionFeedback(Integer score, String feedback, String improved) {
            this.score = score;
            this.feedback = feedback;
            this.improved = improved;
        }

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
        public String getImproved() { return improved; }
        public void setImproved(String improved) { this.improved = improved; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final SectionFeedback sf = new SectionFeedback();
            public Builder score(Integer v) { sf.score = v; return this; }
            public Builder feedback(String v) { sf.feedback = v; return this; }
            public Builder improved(String v) { sf.improved = v; return this; }
            public SectionFeedback build() { return sf; }
        }
    }
}
