import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreGauge from '../components/ScoreGauge';
import CategoryCard from '../components/CategoryCard';
import ParticleBackground from '../components/ParticleBackground';
import { generateSuggestions, downloadPdf } from '../services/api';
import type { AtsReportDTO, ResumeDTO, JobDTO, SuggestionDTO } from '../types';

interface ResultsPageProps {
  report: AtsReportDTO | null;
  resume: ResumeDTO | null;
  job: JobDTO | null;
}

export default function ResultsPage({ report, resume, job }: ResultsPageProps) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SuggestionDTO | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (!report || !resume) {
    return (
      <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>No Analysis Results</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Upload a resume first to see your ATS analysis report.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            📄 Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    { name: 'Skills Match', score: report.skillScore, maxScore: report.skillMaxScore, icon: '🎯', color: '#6366f1' },
    { name: 'Experience', score: report.experienceScore, maxScore: report.experienceMaxScore, icon: '💼', color: '#8b5cf6' },
    { name: 'Keywords', score: report.keywordScore, maxScore: report.keywordMaxScore, icon: '🔑', color: '#06b6d4' },
    { name: 'Education', score: report.educationScore, maxScore: report.educationMaxScore, icon: '🎓', color: '#10b981' },
    { name: 'Location', score: report.locationScore, maxScore: report.locationMaxScore, icon: '📍', color: '#f59e0b' },
    { name: 'Notice Period', score: report.noticeScore, maxScore: report.noticeMaxScore, icon: '⏰', color: '#f97316' },
  ];

  const handleGetAiSuggestions = async () => {
    if (!resume || !job) return;
    setAiLoading(true);
    try {
      const result = await generateSuggestions(resume, job);
      setSuggestions(result);
    } catch (err) {
      console.error('AI suggestions failed:', err);
      setSuggestions({
        improvedSummary: 'AI unavailable. Ensure Ollama is running at localhost:11434.',
        improvedExperience: [],
        improvedProjects: [],
        categorizedSkills: {},
        generalSuggestions: ['Ensure Ollama is running locally to get AI-powered suggestions.'],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resume) return;
    setPdfLoading(true);
    try {
      const blob = await downloadPdf(resume, suggestions || undefined);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.name || 'resume'}_ats_optimized.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <div className="gradient-bg" style={{ position: 'relative' }}>
      <ParticleBackground />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '2.2rem', fontWeight: 800,
            background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
            backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Analysis Report
          </h1>
          {resume.name && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '4px' }}>
              {resume.name} {job?.title && `• ${job.title}`}
            </p>
          )}
        </div>

        {/* Score Hero */}
        <div className="glass-card animate-fade-in animate-fade-in-delay-1"
          style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
          <ScoreGauge score={report.overallScore} grade={report.grade} size={220} />

          {/* Quick Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '28px',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Matched Skills', value: report.matchedSkills.length, color: 'var(--success)' },
              { label: 'Missing Skills', value: report.missingSkills.length, color: 'var(--danger)' },
              { label: 'Keywords Found', value: Object.keys(report.keywordDensity).length, color: 'var(--info)' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Scores Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px', marginBottom: '24px',
        }}>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} {...cat} delay={i * 100} />
          ))}
        </div>

        {/* Skills Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Matched Skills */}
          <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--success-light)' }}>
              ✅ Matched Skills ({report.matchedSkills.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {report.matchedSkills.length > 0 ? report.matchedSkills.map(skill => (
                <span key={skill} className="skill-chip skill-chip-matched">
                  ✓ {skill}
                </span>
              )) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No skills matched</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--danger-light)' }}>
              ❌ Missing Skills ({report.missingSkills.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {report.missingSkills.length > 0 ? report.missingSkills.map(skill => (
                <span key={skill} className="skill-chip skill-chip-missing">
                  ✗ {skill}
                </span>
              )) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>All skills matched! 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Keyword Density */}
        {Object.keys(report.keywordDensity).length > 0 && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              🔑 Keyword Frequency
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(report.keywordDensity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 20)
                .map(([keyword, count]) => (
                  <span key={keyword} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    background: `rgba(6, 182, 212, ${Math.min(0.3, count * 0.05 + 0.05)})`,
                    color: 'var(--info)', fontSize: `${Math.min(16, 12 + count)}px`,
                    fontWeight: 600, border: '1px solid rgba(6, 182, 212, 0.2)',
                  }}>
                    {keyword} <sup style={{ fontSize: '10px' }}>×{count}</sup>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {report.suggestions.length > 0 && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--warning)' }}>
              💡 Improvement Suggestions
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.suggestions.map((sug, i) => (
                <li key={i} style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.12)',
                  color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5,
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <span style={{ color: 'var(--warning)', flexShrink: 0 }}>→</span>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Section */}
        <div className="ai-card animate-fade-in" style={{ marginBottom: '24px' }}>
          <div className="ai-card-title">🤖 AI-Powered Improvements</div>

          {!suggestions ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                Get AI-powered resume improvements using Ollama (Llama 3.1 8B)
              </p>
              <button
                className="btn-primary"
                onClick={handleGetAiSuggestions}
                disabled={aiLoading}
                style={{ padding: '12px 32px' }}
              >
                {aiLoading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Generating...
                  </>
                ) : (
                  '✨ Generate AI Suggestions'
                )}
              </button>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
                Requires Ollama running at localhost:11434
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Improved Summary */}
              {suggestions.improvedSummary && (
                <div>
                  <button
                    onClick={() => toggleSection('summary')}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: 'rgba(139, 92, 246, 0.08)', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(139, 92, 246, 0.15)', cursor: 'pointer',
                      color: 'var(--accent-light)', fontWeight: 600, fontSize: '14px',
                      fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between',
                    }}
                  >
                    📝 Improved Professional Summary
                    <span>{expandedSections.has('summary') ? '▼' : '▶'}</span>
                  </button>
                  {expandedSections.has('summary') && (
                    <div style={{
                      padding: '16px', marginTop: '8px', borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7,
                    }}>
                      {suggestions.improvedSummary}
                    </div>
                  )}
                </div>
              )}

              {/* Improved Experience */}
              {suggestions.improvedExperience && suggestions.improvedExperience.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('experience')}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: 'rgba(139, 92, 246, 0.08)', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(139, 92, 246, 0.15)', cursor: 'pointer',
                      color: 'var(--accent-light)', fontWeight: 600, fontSize: '14px',
                      fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between',
                    }}
                  >
                    💼 Improved Experience Bullets
                    <span>{expandedSections.has('experience') ? '▼' : '▶'}</span>
                  </button>
                  {expandedSections.has('experience') && (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {suggestions.improvedExperience.map((exp, i) => (
                        <div key={i} style={{
                          padding: '16px', borderRadius: 'var(--radius-md)',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                        }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', fontSize: '14px' }}>
                            {exp.title} {exp.company && `at ${exp.company}`}
                          </p>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {exp.improvedBullets.map((bullet, j) => (
                              <li key={j} style={{
                                color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6,
                                paddingLeft: '16px', position: 'relative',
                              }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* General Suggestions */}
              {suggestions.generalSuggestions && suggestions.generalSuggestions.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('general')}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: 'rgba(139, 92, 246, 0.08)', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(139, 92, 246, 0.15)', cursor: 'pointer',
                      color: 'var(--accent-light)', fontWeight: 600, fontSize: '14px',
                      fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between',
                    }}
                  >
                    💡 General AI Tips
                    <span>{expandedSections.has('general') ? '▼' : '▶'}</span>
                  </button>
                  {expandedSections.has('general') && (
                    <ul style={{
                      marginTop: '8px', listStyle: 'none',
                      display: 'flex', flexDirection: 'column', gap: '6px',
                    }}>
                      {suggestions.generalSuggestions.map((tip, i) => (
                        <li key={i} style={{
                          padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)',
                          fontSize: '13px', display: 'flex', gap: '8px',
                        }}>
                          <span style={{ color: 'var(--accent)' }}>✦</span> {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/studio')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4, #6366f1)',
              padding: '12px 32px', fontSize: '15px', fontWeight: 700,
            }}
          >
            ⚡ Open Resume Studio (Live A4 Editor)
          </button>
          <button className="btn-secondary" onClick={handleDownloadPdf} disabled={pdfLoading}>
            {pdfLoading ? 'Generating PDF...' : '📥 Download ATS Resume PDF'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            📊 View Dashboard
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            🔄 Analyze Another
          </button>
        </div>
      </div>
    </div>
  );
}
