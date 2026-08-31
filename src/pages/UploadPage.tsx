import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingOverlay from '../components/LoadingOverlay';
import ParticleBackground from '../components/ParticleBackground';
import { uploadResume, parseJobDescription, calculateAtsScore } from '../services/api';
import type { ResumeDTO, JobDTO, AtsReportDTO } from '../types';

interface UploadPageProps {
  onAnalysisComplete: (report: AtsReportDTO, resume: ResumeDTO, job: JobDTO) => void;
}

export default function UploadPage({ onAnalysisComplete }: UploadPageProps) {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [jdMode, setJdMode] = useState<'paste' | 'upload' | 'none'>('paste');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile) {
      setError('Please upload a resume PDF first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload and parse resume
      const resume: ResumeDTO = await uploadResume(resumeFile);

      // Step 2: Parse JD (if provided)
      let job: JobDTO;
      if (jdMode === 'paste' && jdText.trim()) {
        job = await parseJobDescription(jdText);
      } else if (jdMode === 'upload' && jdFile) {
        // Upload JD PDF - for simplicity, use text mode
        job = { title: '', requiredSkills: [], preferredSkills: [], experience: '', experienceYears: 0, education: '', location: '', noticePeriod: '', responsibilities: [], tools: [], rawText: '' };
      } else {
        // Empty JD mode - ATS readiness only
        job = { title: 'General ATS Check', requiredSkills: [], preferredSkills: [], experience: '', experienceYears: 0, education: '', location: '', noticePeriod: '', responsibilities: [], tools: [], rawText: '' };
      }

      // Step 3: Calculate ATS score
      const report = await calculateAtsScore(resume, job);

      onAnalysisComplete(report, resume, job);
      navigate('/results');
    } catch (err: any) {
      console.error('Analysis error details:', err);
      const detail = err.response?.data?.message || err.response?.statusText || err.message || 'Network error connecting to backend.';
      setError(`Analysis failed (${err.response?.status || 'Connection Error'}): ${detail}`);
    } finally {
      setLoading(false);
    }
  }, [resumeFile, jdText, jdMode, jdFile, navigate, onAnalysisComplete]);

  return (
    <div className="gradient-bg" style={{ position: 'relative' }}>
      <ParticleBackground />

      {loading && (
        <LoadingOverlay
          message="Analyzing Your Resume..."
          subMessage="Running deterministic ATS scoring across 6 categories"
        />
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Hero Section */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: '20px', fontSize: '13px', color: 'var(--primary-light)', fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
            Powered by Deterministic AI Engine
          </div>

          <h1 style={{
            fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #6366f1 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ATS Resume<br />Analyzer
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
            Upload your resume and job description to get an instant ATS compatibility score
            with actionable improvement suggestions.
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card animate-fade-in animate-fade-in-delay-1" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            📄 Upload Resume
          </h2>
          <FileUpload
            onFileSelect={(file) => { setResumeFile(file); setError(null); }}
            accept=".pdf"
            label="Drop your resume here"
            sublabel="PDF format • Max 10MB"
          />
        </div>

        {/* JD Section */}
        <div className="glass-card animate-fade-in animate-fade-in-delay-2" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            💼 Job Description
          </h2>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { key: 'paste' as const, label: 'Paste Text', icon: '📝' },
              { key: 'upload' as const, label: 'Upload PDF', icon: '📎' },
              { key: 'none' as const, label: 'Skip (ATS Only)', icon: '⚡' },
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setJdMode(mode.key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${jdMode === mode.key ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: jdMode === mode.key ? 'rgba(99, 102, 241, 0.15)' : 'var(--surface)',
                  color: jdMode === mode.key ? 'var(--primary-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 200ms ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>

          {jdMode === 'paste' && (
            <textarea
              className="textarea-glow"
              placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Java Developer with 5+ years of experience in Spring Boot, Microservices, Docker, and AWS..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          )}

          {jdMode === 'upload' && (
            <FileUpload
              onFileSelect={(file) => setJdFile(file)}
              accept=".pdf"
              label="Drop job description PDF"
              sublabel="PDF format"
            />
          )}

          {jdMode === 'none' && (
            <div style={{
              padding: '32px', textAlign: 'center',
              background: 'rgba(245, 158, 11, 0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
            }}>
              <p style={{ color: 'var(--warning)', fontSize: '14px', fontWeight: 500 }}>
                ⚡ No JD provided — will analyze ATS readiness only
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                For a full match score, provide a job description
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-fade-in" style={{
            padding: '16px 20px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger-light)', fontSize: '14px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="animate-fade-in animate-fade-in-delay-3" style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!resumeFile || loading}
            style={{ padding: '16px 48px', fontSize: '16px' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze Resume
              </>
            )}
          </button>

          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>
            No data is stored • Everything processed in-memory
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginTop: '60px',
        }}>
          {[
            { icon: '🎯', title: 'ATS Score', desc: 'Deterministic 6-category weighted scoring' },
            { icon: '🔍', title: 'Skill Match', desc: 'Exact + synonym skill matching engine' },
            { icon: '🤖', title: 'AI Improve', desc: 'Ollama-powered resume enhancement' },
            { icon: '📄', title: 'PDF Export', desc: 'Download ATS-optimized resume PDF' },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card animate-fade-in"
              style={{
                padding: '24px', textAlign: 'center',
                animationDelay: `${0.4 + i * 0.1}s`, opacity: 0,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
