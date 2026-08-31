import axios from 'axios';
import type { ResumeDTO, JobDTO, AtsReportDTO, SuggestionDTO } from '../types';

// Base API client with Basic Auth (configurable via VITE_API_URL in production/Vercel)
let rawBaseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl += '/api';
}

const api = axios.create({
  baseURL: rawBaseUrl,
  auth: {
    username: 'admin',
    password: 'admin123',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a resume PDF and get parsed data.
 */
export async function uploadResume(file: File): Promise<ResumeDTO> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ResumeDTO>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Parse a job description from text.
 */
export async function parseJobDescription(text: string): Promise<JobDTO> {
  const response = await api.post<JobDTO>('/job/parse', text, {
    headers: { 'Content-Type': 'text/plain' },
  });
  return response.data;
}

/**
 * Calculate ATS score for resume against job.
 */
export async function calculateAtsScore(resume: ResumeDTO, job: JobDTO): Promise<AtsReportDTO> {
  const response = await api.post<AtsReportDTO>('/ats/calculate', { resume, job });
  return response.data;
}

/**
 * Generate AI-improved professional summary.
 */
export async function improveSummary(resume: ResumeDTO, job: JobDTO): Promise<string> {
  const response = await api.post<{ summary: string }>('/ai/summary', { resume, job });
  return response.data.summary;
}

/**
 * Generate full AI improvement suggestions.
 */
export async function generateSuggestions(resume: ResumeDTO, job: JobDTO): Promise<SuggestionDTO> {
  const response = await api.post<SuggestionDTO>('/ai/improve', { resume, job });
  return response.data;
}

/**
 * Download ATS-friendly resume PDF.
 */
export async function downloadPdf(resume: ResumeDTO, suggestions?: SuggestionDTO): Promise<Blob> {
  const response = await api.post('/ats/pdf', { resume, suggestions }, {
    responseType: 'blob',
  });
  return response.data;
}

export default api;
