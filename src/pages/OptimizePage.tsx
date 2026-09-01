import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import { calculateAtsScore, generateSuggestions, downloadPdf } from '../services/api';
import type { AtsReportDTO, ResumeDTO, JobDTO, SuggestionDTO } from '../types';

interface OptimizePageProps {
  report: AtsReportDTO | null;
  resume: ResumeDTO | null;
  job: JobDTO | null;
  onUpdateResume: (updatedResume: ResumeDTO, updatedReport: AtsReportDTO) => void;
}

const TEMPLATES = [
  { id: 'modern', name: 'Modern Workday', desc: 'Sleek blue accent, balanced spacing, standard SaaS ATS style' },
  { id: 'latex', name: 'LaTeX Minimalist', desc: 'Single-page high-impact, tight vertical rhythm, tech-focused' },
  { id: 'ivy', name: 'Ivy League Classic', desc: 'Traditional serif typography, horizontal dividers, academic tone' },
  { id: 'executive', name: 'Executive Bold', desc: 'Dark slate headers, strong title weights, leadership focus' },
  { id: 'compact', name: 'Compact High-Density', desc: 'Maximum content density, optimized for 5+ years experience' },
];

export default function OptimizePage({ report, resume, job, onUpdateResume }: OptimizePageProps) {
  const navigate = useNavigate();

  const [currentResume, setCurrentResume] = useState<ResumeDTO | null>(resume);
  const [currentReport, setCurrentReport] = useState<AtsReportDTO | null>(report);
  const [suggestions, setSuggestions] = useState<SuggestionDTO | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  // Initial load: Fetch AI suggestions via Gemini if not already generated
  useEffect(() => {
    if (currentResume && job && !suggestions) {
      handleFetchSuggestions();
    }
  }, []);

  const handleFetchSuggestions = async (customKey?: string) => {
    if (!currentResume || !job) return;
    setAiLoading(true);
    try {
      const keyToUse = customKey !== undefined ? customKey : geminiKey;
      const res = await generateSuggestions(currentResume, job, keyToUse);
      setSuggestions(res);
    } catch (e) {
      console.warn('Failed to load AI suggestions:', e);
    } finally {
      setAiLoading(false);
    }
  };

  // Recalculate score live whenever resume changes
  const updateResumeAndRecalculate = async (updated: ResumeDTO) => {
    setCurrentResume(updated);
    if (job) {
      try {
        const newReport = await calculateAtsScore(updated, job);
        setCurrentReport(newReport);
        onUpdateResume(updated, newReport);
      } catch (err) {
        console.error('Score recalculation failed', err);
      }
    }
  };

  if (!currentResume || !currentReport || !job) {
    return (
      <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡️</div>
          <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>No Resume Loaded</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Please upload your resume and job description first.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            📄 Upload Resume
          </button>
        </div>
      </div>
    );
  }

  // --- Actions ---

  const handleAddMissingSkill = (skillToAdd: string) => {
    const existing = currentResume.skills || [];
    if (!existing.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      const updated = {
        ...currentResume,
        skills: [...existing, skillToAdd],
      };
      updateResumeAndRecalculate(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...currentResume,
      skills: (currentResume.skills || []).filter(s => s !== skillToRemove),
    };
    updateResumeAndRecalculate(updated);
  };

  const handleAddCustomSkill = () => {
    if (!newSkillInput.trim()) return;
    handleAddMissingSkill(newSkillInput.trim());
    setNewSkillInput('');
  };

  const handleApplySummary = (newSummary: string) => {
    const updated = {
      ...currentResume,
      summary: newSummary,
    };
    updateResumeAndRecalculate(updated);
  };

  const handleReplaceBullet = (expIndex: number, bulletIndex: number, newBullet: string) => {
    if (!currentResume.experience) return;
    const exps = [...currentResume.experience];
    const exp = { ...exps[expIndex] };
    const bullets = [...(exp.bullets || [])];
    bullets[bulletIndex] = newBullet;
    exp.bullets = bullets;
    exps[expIndex] = exp;

    updateResumeAndRecalculate({
      ...currentResume,
      experience: exps,
    });
  };

  const handleAppendBullet = (expIndex: number, newBullet: string) => {
    if (!currentResume.experience) return;
    const exps = [...currentResume.experience];
    const exp = { ...exps[expIndex] };
    exp.bullets = [...(exp.bullets || []), newBullet];
    exps[expIndex] = exp;

    updateResumeAndRecalculate({
      ...currentResume,
      experience: exps,
    });
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const blob = await downloadPdf(currentResume, suggestions || undefined, selectedTemplate);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentResume.name || 'resume'}_${selectedTemplate}_ats.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', tempKey.trim());
    setGeminiKey(tempKey.trim());
    setShowKeyModal(false);
    handleFetchSuggestions(tempKey.trim());
  };

  return (
    <div className="gradient-bg" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      <ParticleBackground />

      {/* Top Action Bar */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 90,
        background: 'rgba(10, 10, 26, 0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)', padding: '14px 24px',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
        }}>
          {/* Live ATS Score Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '24px', fontWeight: 900,
                color: currentReport.overallScore >= 85 ? 'var(--success)' : currentReport.overallScore >= 60 ? 'var(--warning)' : 'var(--danger)',
              }}>
                {currentReport.overallScore}%
              </span>
              <span style={{
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                background: currentReport.overallScore >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: currentReport.overallScore >= 85 ? 'var(--success-light)' : 'var(--warning-light)',
                fontWeight: 700, fontSize: '13px',
              }}>
                Grade: {currentReport.grade}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              🎯 Live ATS Score Optimizer
            </span>
          </div>

          {/* Template Selector & Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Template Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TEMPLATE:</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{
                  background: 'var(--surface)', color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                  padding: '8px 12px', fontSize: '13px', fontWeight: 600, outline: 'none',
                }}
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#0f0f2e', color: '#fff' }}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gemini API Key Button */}
            <button
              onClick={() => { setTempKey(geminiKey); setShowKeyModal(true); }}
              style={{
                padding: '8px 14px', borderRadius: 'var(--radius-md)',
                background: geminiKey ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                border: `1px solid ${geminiKey ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`,
                color: geminiKey ? 'var(--success-light)' : 'var(--primary-light)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {aiLoading ? '✨ Gemini Thinking...' : geminiKey ? '✨ Gemini 1.5 Active' : '🔑 Set Gemini API Key'}
            </button>

            {/* Download PDF */}
            <button
              className="btn-primary"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              {pdfLoading ? 'Generating PDF...' : '📥 Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div style={{ maxWidth: '1400px', margin: '24px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>

          {/* ==================================================== */}
          {/* LEFT PANE: LIVE RESUME EDITOR                       */}
          {/* ==================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Candidate Header */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                👤 Candidate Profile
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>NAME</label>
                  <input
                    type="text"
                    value={currentResume.name || ''}
                    onChange={(e) => updateResumeAndRecalculate({ ...currentResume, name: e.target.value })}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)', fontSize: '14px', marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION</label>
                  <input
                    type="text"
                    value={currentResume.location || ''}
                    onChange={(e) => updateResumeAndRecalculate({ ...currentResume, location: e.target.value })}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)', fontSize: '14px', marginTop: '4px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  📝 Professional Summary
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {currentResume.summary ? `${currentResume.summary.split(/\s+/).length} words` : '0 words'}
                </span>
              </div>
              <textarea
                className="textarea-glow"
                rows={4}
                value={currentResume.summary || ''}
                onChange={(e) => updateResumeAndRecalculate({ ...currentResume, summary: e.target.value })}
                placeholder="Write a concise, ATS-optimized professional summary..."
                style={{ minHeight: '110px' }}
              />
            </div>

            {/* Technical Skills */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🎯 Technical Skills ({currentResume.skills?.length || 0})
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--success-light)', fontWeight: 600 }}>
                  Match: {currentReport.skillScore}/{currentReport.skillMaxScore} pts
                </span>
              </div>

              {/* Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {currentResume.skills?.map(skill => (
                  <span
                    key={skill}
                    style={{
                      padding: '5px 12px', borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)',
                      border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '13px',
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer', fontSize: '12px', lineHeight: 1, padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add another skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)', fontSize: '13px',
                  }}
                />
                <button className="btn-secondary" onClick={handleAddCustomSkill} style={{ padding: '8px 16px', fontSize: '13px' }}>
                  + Add
                </button>
              </div>
            </div>

            {/* Work Experience */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  💼 Work Experience
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--accent-light)', fontWeight: 600 }}>
                  Score: {currentReport.experienceScore}/{currentReport.experienceMaxScore} pts
                </span>
              </div>

              {currentResume.experience?.map((exp, i) => (
                <div key={i} style={{
                  padding: '16px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
                  marginBottom: '14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {exp.title} {exp.company && `— ${exp.company}`}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {exp.duration || `${exp.years || 0} yrs`}
                    </span>
                  </div>

                  {/* Bullet points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {exp.bullets?.map((bullet, j) => (
                      <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary-light)', marginTop: '4px' }}>•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleReplaceBullet(i, j, e.target.value)}
                          style={{
                            flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ==================================================== */}
          {/* RIGHT PANE: AI RECOMMENDATIONS & MISSING SKILLS     */}
          {/* ==================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Missing Required Skills */}
            <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--danger-light)' }}>
                  ❌ Missing Required Skills ({currentReport.missingSkills?.length || 0})
                </h2>
              </div>

              {currentReport.missingSkills && currentReport.missingSkills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Click <strong>+ Add to Resume</strong> to include in your skills section and boost your ATS score:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentReport.missingSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleAddMissingSkill(skill)}
                        style={{
                          padding: '6px 14px', borderRadius: 'var(--radius-full)',
                          background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger-light)',
                          border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '13px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                          fontWeight: 600, transition: 'all 0.2s',
                        }}
                      >
                        + Add {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '16px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: 'var(--success-light)', fontSize: '13px', fontWeight: 600,
                }}>
                  🎉 All required job skills are present in your resume! (40/40 pts)
                </div>
              )}
            </div>

            {/* AI Summary Recommendation (Gemini 1.5 Flash) */}
            {suggestions?.improvedSummary && (
              <div className="ai-card">
                <div className="ai-card-title">✨ Gemini 1.5 Flash: Optimized Summary</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  {suggestions.improvedSummary}
                </p>
                <button
                  className="btn-primary"
                  onClick={() => handleApplySummary(suggestions.improvedSummary)}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  ✨ Apply This Summary
                </button>
              </div>
            )}

            {/* AI Improved Experience Bullets */}
            {suggestions?.improvedExperience && suggestions.improvedExperience.length > 0 && (
              <div className="ai-card">
                <div className="ai-card-title">💼 Gemini Enhanced Experience Bullets</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Formulated as: <strong>Action Verb + Technology + Measurable Business Impact</strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {suggestions.improvedExperience.map((exp, i) => (
                    <div key={i} style={{
                      padding: '14px', borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                    }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {exp.title}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {exp.improvedBullets?.map((bullet, j) => (
                          <div key={j} style={{
                            fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.06)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                          }}>
                            <p style={{ marginBottom: '6px' }}>• {bullet}</p>
                            <button
                              onClick={() => handleAppendBullet(i, bullet)}
                              style={{
                                padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                                background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-light)',
                                border: '1px solid rgba(139, 92, 246, 0.4)', fontSize: '11px',
                                cursor: 'pointer', fontWeight: 600,
                              }}
                            >
                              + Append to Experience
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
              🔑 Google Gemini API Key
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Get a free API key at <strong>aistudio.google.com</strong> (100% free, 15 req/min).
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', fontSize: '14px', marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowKeyModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveApiKey}>
                Save & Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
