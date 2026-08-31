// TypeScript interfaces matching backend DTOs

export interface ExperienceDTO {
  title: string;
  company: string;
  duration: string;
  years: number;
  bullets: string[];
}

export interface ProjectDTO {
  name: string;
  description: string;
  technologies: string[];
  bullets: string[];
}

export interface ResumeDTO {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: ExperienceDTO[];
  projects: ProjectDTO[];
  education: string;
  location: string;
  noticePeriod: string;
  certifications: string[];
}

export interface JobDTO {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  experienceYears: number;
  education: string;
  location: string;
  noticePeriod: string;
  responsibilities: string[];
  tools: string[];
  rawText: string;
}

export interface AtsReportDTO {
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  keywordScore: number;
  educationScore: number;
  locationScore: number;
  noticeScore: number;
  skillMaxScore: number;
  experienceMaxScore: number;
  keywordMaxScore: number;
  educationMaxScore: number;
  locationMaxScore: number;
  noticeMaxScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywordDensity: Record<string, number>;
  suggestions: string[];
  grade: string;
  resume: ResumeDTO;
  job: JobDTO;
}

export interface ImprovedExperienceDTO {
  title: string;
  company: string;
  improvedBullets: string[];
}

export interface ImprovedProjectDTO {
  name: string;
  improvedBullets: string[];
}

export interface SuggestionDTO {
  improvedSummary: string;
  improvedExperience: ImprovedExperienceDTO[];
  improvedProjects: ImprovedProjectDTO[];
  categorizedSkills: Record<string, string[]>;
  generalSuggestions: string[];
}

// Category score data for charts
export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  color: string;
  icon: string;
}
