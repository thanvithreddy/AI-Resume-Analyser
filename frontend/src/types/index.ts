export interface SectionFeedback {
  score: number;
  feedback: string;
  improved: string;
}

export interface AnalysisResult {
  id: number;
  resumeFileName: string;
  overallScore: number;
  atsScore: number;
  skillsScore: number;
  experienceScore: number;
  formattingScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summaryFeedback: SectionFeedback;
  experienceFeedback: SectionFeedback;
  skillsFeedback: SectionFeedback;
  topIssues: string[];
  suggestions: string[];
  rewrittenResume: string;
  createdAt: string;
}
