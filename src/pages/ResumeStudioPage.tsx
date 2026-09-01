import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import A4ResumeCanvas from '../components/A4ResumeCanvas';
import JdGapAnalysisPanel from '../components/JdGapAnalysisPanel';
import { calculateAtsScore, generateSuggestions, downloadPdf } from '../services/api';
import { exportToDocx } from '../utils/docxExport';
import type { AtsReportDTO, ResumeDTO, JobDTO, SuggestionDTO } from '../types';

interface StudioPageProps {
  report: AtsReportDTO | null;
  resume: ResumeDTO | null;
  job: JobDTO | null;
  onUpdateResume: (updatedResume: ResumeDTO, updatedReport: AtsReportDTO) => void;
}

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal ATS', tag: 'Best for SWE', desc: 'Single-column, tight vertical rhythm' },
  { id: 'executive', name: 'Executive', tag: 'Senior & Enterprise', desc: 'Dark slate headers, leadership focus' },
  { id: 'modern-blue', name: 'Modern Blue', tag: 'Modern Clean', desc: 'Electric blue accents, balanced spacing' },
  { id: 'two-column', name: 'Two-Column', tag: 'Sidebar Layout', desc: 'Skills & education sidebar, main experience' },
  { id: 'compact', name: 'Compact Tech', tag: 'Max Density', desc: 'Maximum information density for 5+ yrs exp' },
  { id: 'harvard', name: 'Harvard Style', tag: 'Academic Standard', desc: 'Classical serif typography, horizontal rules' },
];

export default function ResumeStudioPage({ report, resume, job, onUpdateResume }: StudioPageProps) {
  const navigate = useNavigate();

  const [currentResume, setCurrentResume] = useState<ResumeDTO | null>(resume);
  const [currentReport, setCurrentReport] = useState<AtsReportDTO | null>(report);
  const [suggestions, setSuggestions] = useState<SuggestionDTO | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('minimal');
  const [zoom, setZoom] = useState<number>(0.92);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Initial fetch of Gemini suggestions in background
  useEffect(() => {
    if (currentResume && job && !suggestions) {
      generateSuggestions(currentResume, job)
        .then(res => setSuggestions(res))
        .catch(err => console.warn('Gemini auto-suggestion warning:', err));
    }
  }, []);

  if (!currentResume || !currentReport || !job) {
    return (
      <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>Resume Studio</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Please upload your resume and job description to launch the live A4 editor.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            📄 Upload Resume
          </button>
        </div>
      </div>
    );
  }

  // --- Real-time ATS Recalculation ---
  const updateResume = async (updated: ResumeDTO) => {
    setCurrentResume(updated);
    if (job) {
      try {
        const newReport = await calculateAtsScore(updated, job);
        setCurrentReport(newReport);
        onUpdateResume(updated, newReport);
      } catch (err) {
        console.error('Real-time score update failed:', err);
      }
    }
  };

  // --- Actions ---
  const handleAddSkill = (skill: string) => {
    const existing = currentResume.skills || [];
    if (!existing.some(s => s.toLowerCase() === skill.toLowerCase())) {
      updateResume({
        ...currentResume,
        skills: [...existing, skill],
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    updateResume({
      ...currentResume,
      skills: (currentResume.skills || []).filter(s => s !== skill),
    });
  };

  const handleApplySummary = (summary: string) => {
    updateResume({
      ...currentResume,
      summary,
    });
  };

  const handleAppendExperienceBullet = (expIndex: number, bullet: string) => {
    if (!currentResume.experience) return;
    const exps = [...currentResume.experience];
    const exp = { ...exps[expIndex] };
    exp.bullets = [...(exp.bullets || []), bullet];
    exps[expIndex] = exp;
    updateResume({ ...currentResume, experience: exps });
  };

  const handleReplaceExperienceBullet = (expIndex: number, bulletIndex: number, bullet: string) => {
    if (!currentResume.experience) return;
    const exps = [...currentResume.experience];
    const exp = { ...exps[expIndex] };
    const bullets = [...(exp.bullets || [])];
    bullets[bulletIndex] = bullet;
    exp.bullets = bullets;
    exps[expIndex] = exp;
    updateResume({ ...currentResume, experience: exps });
  };

  const handleAddExperience = () => {
    const newExp = {
      title: 'Software Engineer',
      company: 'Company Name',
      duration: '2025 – Present',
      years: 1,
      bullets: ['Architected scalable REST APIs and backend microservices, improving throughput by 30%.'],
    };
    updateResume({
      ...currentResume,
      experience: [...(currentResume.experience || []), newExp],
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!currentResume.experience) return;
    updateResume({
      ...currentResume,
      experience: currentResume.experience.filter((_, i) => i !== index),
    });
  };

  // --- Exports ---
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const blob = await downloadPdf(currentResume, suggestions || undefined, selectedTemplate);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(currentResume.name || 'resume').replace(/\s+/g, '_')}_${selectedTemplate}_ats.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadDocx = () => {
    exportToDocx(currentResume, suggestions, selectedTemplate);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentResume, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${(currentResume.name || 'resume').replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-studio-root" style={{ background: '#0a0a1a', minHeight: '100vh', color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <div style={{
        background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Left: Title & Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚡ Resume Studio
            </span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155',
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
          }}>
            <span style={{
              fontSize: '16px', fontWeight: 900,
              color: currentReport.overallScore >= 80 ? '#10b981' : currentReport.overallScore >= 60 ? '#f59e0b' : '#ef4444',
            }}>
              {currentReport.overallScore}%
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              ATS Match ({currentReport.grade})
            </span>
          </div>
        </div>

        {/* Center: Template Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Template:</span>
          <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '6px' }}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                title={t.desc}
                style={{
                  background: selectedTemplate === t.id ? '#6366f1' : 'transparent',
                  color: selectedTemplate === t.id ? '#ffffff' : '#94a3b8',
                  border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11.5px',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Zoom & Export Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: '4px', padding: '2px' }}>
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.08))}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', padding: '4px 8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              -
            </button>
            <span style={{ fontSize: '11px', color: '#94a3b8', minWidth: '40px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.4, z + 0.08))}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', padding: '4px 8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              +
            </button>
          </div>

          {/* Word Export */}
          <button
            onClick={handleDownloadDocx}
            style={{
              background: '#1e293b', color: '#38bdf8', border: '1px solid #0284c7',
              padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            📄 Word (.docx)
          </button>

          {/* JSON Export */}
          <button
            onClick={handleDownloadJson}
            style={{
              background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155',
              padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            📋 JSON
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            style={{
              background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155',
              padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            🖨️ Print
          </button>

          {/* PDF Download */}
          <button
            className="btn-primary"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 700 }}
          >
            {pdfLoading ? 'Building PDF...' : '📥 Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Studio Body: 3-Column Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr 340px', flex: 1, minHeight: 'calc(100vh - 56px)' }}>

        {/* ========================================================= */}
        {/* LEFT COLUMN: WORD-LIKE RICH RESUME EDITOR                 */}
        {/* ========================================================= */}
        <div style={{
          background: '#0f172a', borderRight: '1px solid #1e293b',
          overflowY: 'auto', maxHeight: 'calc(100vh - 56px)', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Section Selector Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
            {[
              { id: 'profile', label: '👤 Profile' },
              { id: 'summary', label: '📝 Summary' },
              { id: 'skills', label: `🎯 Skills (${currentResume.skills?.length || 0})` },
              { id: 'experience', label: '💼 Experience' },
              { id: 'projects', label: '🚀 Projects' },
              { id: 'education', label: '🎓 Education' },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                  background: activeSection === sec.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeSection === sec.id ? 'var(--primary)' : '#334155'}`,
                  color: activeSection === sec.id ? '#a5b4fc' : '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* 1. Profile Section */}
          {activeSection === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Candidate Header</h3>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>FULL NAME</label>
                <input
                  type="text"
                  value={currentResume.name || ''}
                  onChange={(e) => updateResume({ ...currentResume, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</label>
                <input
                  type="text"
                  value={currentResume.email || ''}
                  onChange={(e) => updateResume({ ...currentResume, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</label>
                <input
                  type="text"
                  value={currentResume.phone || ''}
                  onChange={(e) => updateResume({ ...currentResume, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>LOCATION</label>
                <input
                  type="text"
                  value={currentResume.location || ''}
                  onChange={(e) => updateResume({ ...currentResume, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
            </div>
          )}

          {/* 2. Professional Summary Section */}
          {activeSection === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Professional Summary</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {currentResume.summary ? currentResume.summary.split(/\s+/).filter(Boolean).length : 0} words
                </span>
              </div>
              <textarea
                rows={8}
                value={currentResume.summary || ''}
                onChange={(e) => updateResume({ ...currentResume, summary: e.target.value })}
                placeholder="Write your professional summary with key achievements..."
                style={{
                  width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155',
                  borderRadius: '4px', color: '#fff', fontSize: '12.5px', lineHeight: 1.5, resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* 3. Technical Skills Section */}
          {activeSection === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Technical Skills</h3>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  Match: {currentReport.skillScore}/{currentReport.skillMaxScore} pts
                </span>
              </div>

              {/* Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {currentResume.skills?.map(skill => (
                  <span
                    key={skill}
                    style={{
                      background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)',
                      padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '11px' }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input
                  type="text"
                  placeholder="Type new skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkillInput.trim()) {
                      handleAddSkill(newSkillInput.trim());
                      setNewSkillInput('');
                    }
                  }}
                  style={{ flex: 1, padding: '7px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                />
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      handleAddSkill(newSkillInput.trim());
                      setNewSkillInput('');
                    }
                  }}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  + Add
                </button>
              </div>
            </div>
          )}

          {/* 4. Experience Section */}
          {activeSection === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Work Experience</h3>
                <button
                  className="btn-secondary"
                  onClick={handleAddExperience}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  + Add Role
                </button>
              </div>

              {currentResume.experience?.map((exp, i) => (
                <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={exp.title || ''}
                      placeholder="Job Title"
                      onChange={(e) => {
                        const exps = [...(currentResume.experience || [])];
                        exps[i] = { ...exps[i], title: e.target.value };
                        updateResume({ ...currentResume, experience: exps });
                      }}
                      style={{ fontWeight: 700, background: 'none', border: 'none', color: '#fff', fontSize: '13px', width: '60%' }}
                    />
                    <button
                      onClick={() => handleRemoveExperience(i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>

                  <input
                    type="text"
                    value={exp.company || ''}
                    placeholder="Company Name"
                    onChange={(e) => {
                      const exps = [...(currentResume.experience || [])];
                      exps[i] = { ...exps[i], company: e.target.value };
                      updateResume({ ...currentResume, experience: exps });
                    }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', width: '100%', marginBottom: '8px' }}
                  />

                  {/* Bullet points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {exp.bullets?.map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#6366f1', marginTop: '4px' }}>•</span>
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => handleReplaceExperienceBullet(i, j, e.target.value)}
                          style={{
                            flex: 1, padding: '4px 8px', background: '#0f172a', border: '1px solid #334155',
                            borderRadius: '3px', color: '#cbd5e1', fontSize: '11.5px', lineHeight: 1.4,
                          }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleAppendExperienceBullet(i, 'Architected and deployed new service module, optimizing performance.')}
                      style={{
                        background: 'none', border: '1px dashed #475569', color: '#94a3b8',
                        padding: '4px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', marginTop: '4px',
                      }}
                    >
                      + Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Projects Section */}
          {activeSection === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Key Projects</h3>
              {currentResume.projects?.map((proj, i) => (
                <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '10px' }}>
                  <input
                    type="text"
                    value={proj.name || ''}
                    placeholder="Project Name"
                    onChange={(e) => {
                      const projs = [...(currentResume.projects || [])];
                      projs[i] = { ...projs[i], name: e.target.value };
                      updateResume({ ...currentResume, projects: projs });
                    }}
                    style={{ fontWeight: 700, background: 'none', border: 'none', color: '#fff', fontSize: '12.5px', width: '100%', marginBottom: '4px' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {proj.bullets?.map((b, j) => (
                      <div key={j} style={{ fontSize: '11px', color: '#cbd5e1' }}>• {b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. Education Section */}
          {activeSection === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Education</h3>
              <textarea
                rows={4}
                value={currentResume.education || ''}
                onChange={(e) => updateResume({ ...currentResume, education: e.target.value })}
                style={{
                  width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155',
                  borderRadius: '4px', color: '#fff', fontSize: '12.5px', lineHeight: 1.5,
                }}
              />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: LIVE REAL A4 RESUME CANVAS                 */}
        {/* ========================================================= */}
        <div style={{
          background: '#090d16',
          overflowY: 'auto', maxHeight: 'calc(100vh - 56px)',
          display: 'flex', justifyContent: 'center', padding: '24px 12px',
        }}>
          <A4ResumeCanvas resume={currentResume} templateId={selectedTemplate} zoom={zoom} />
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: JD GAP ANALYSIS & AI GEMINI SUGGESTIONS     */}
        {/* ========================================================= */}
        <div style={{
          background: '#0f172a', borderLeft: '1px solid #1e293b',
          overflowY: 'auto', maxHeight: 'calc(100vh - 56px)', padding: '20px',
        }}>
          <JdGapAnalysisPanel
            report={currentReport}
            job={job}
            suggestions={suggestions}
            onAddSkill={handleAddSkill}
            onApplySummary={handleApplySummary}
            onAppendExperienceBullet={handleAppendExperienceBullet}
          />
        </div>

      </div>

    </div>
  );
}
