import type { AtsReportDTO, JobDTO, SuggestionDTO } from '../types';

interface GapAnalysisProps {
  report: AtsReportDTO;
  job: JobDTO;
  suggestions: SuggestionDTO | null;
  onAddSkill: (skill: string) => void;
  onApplySummary: (summary: string) => void;
  onAppendExperienceBullet: (expIndex: number, bullet: string) => void;
}

export default function JdGapAnalysisPanel({
  report,
  job,
  suggestions,
  onAddSkill,
  onApplySummary,
  onAppendExperienceBullet,
}: GapAnalysisProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
            🎯 JD Gap Analysis
          </h2>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
            Target: <strong>{job.title || 'General Software Engineering'}</strong>
          </p>
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: 'var(--radius-full)',
          background: report.overallScore >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          color: report.overallScore >= 80 ? 'var(--success-light)' : 'var(--warning-light)',
          fontWeight: 700, fontSize: '12px',
        }}>
          Score: {report.overallScore}%
        </span>
      </div>

      {/* 1. Missing Required Skills (High Priority) */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger-light)' }}>
            ⚠️ Missing Skills ({report.missingSkills.length})
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Required in JD</span>
        </div>

        {report.missingSkills.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {report.missingSkills.map(skill => (
              <div key={skill} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(17, 24, 39, 0.6)', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {skill}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Absent from resume
                  </div>
                </div>
                <button
                  onClick={() => onAddSkill(skill)}
                  style={{
                    background: 'var(--primary)', color: '#fff', border: 'none',
                    padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '11px',
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  + Add to Skills
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--success-light)', fontWeight: 600 }}>
            ✓ 100% of required JD skills are matched in your resume!
          </div>
        )}
      </div>

      {/* 2. Matched Skills Verification */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success-light)', display: 'block', marginBottom: '8px' }}>
          ✓ Verified JD Matches ({report.matchedSkills.length})
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {report.matchedSkills.map(skill => (
            <span key={skill} style={{
              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-light)',
              padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 600,
            }}>
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 3. AI Gemini Optimized Summary */}
      {suggestions?.improvedSummary && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-light)' }}>
              ✨ AI Gemini Summary
            </span>
            <button
              onClick={() => onApplySummary(suggestions.improvedSummary)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff',
                border: 'none', padding: '4px 12px', borderRadius: 'var(--radius-sm)',
                fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Apply Change
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {suggestions.improvedSummary}
          </p>
        </div>
      )}

      {/* 4. AI Experience Bullets (Action Verb + Tech + Impact) */}
      {suggestions?.improvedExperience && suggestions.improvedExperience.length > 0 && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-light)', display: 'block', marginBottom: '8px' }}>
            💼 High-Impact Experience Bullets
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestions.improvedExperience.map((exp, i) => (
              <div key={i}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {exp.title}
                </div>
                {exp.improvedBullets?.slice(0, 2).map((bullet, j) => (
                  <div key={j} style={{
                    background: 'rgba(17, 24, 39, 0.6)', padding: '8px', borderRadius: 'var(--radius-sm)',
                    marginBottom: '6px', border: '1px solid rgba(139, 92, 246, 0.15)',
                  }}>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      • {bullet}
                    </p>
                    <button
                      onClick={() => onAppendExperienceBullet(i, bullet)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-light)',
                        border: '1px solid rgba(139, 92, 246, 0.4)', padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)', fontSize: '10.5px', fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Apply to Experience
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Live ATS Health Indicator */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          ATS Health Diagnostics
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div style={{ padding: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Skills</div>
            <div style={{ fontWeight: 700, color: 'var(--success-light)' }}>{report.skillScore}/{report.skillMaxScore} pts</div>
          </div>
          <div style={{ padding: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Experience</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{report.experienceScore}/{report.experienceMaxScore} pts</div>
          </div>
          <div style={{ padding: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Keywords</div>
            <div style={{ fontWeight: 700, color: 'var(--info)' }}>{report.keywordScore}/{report.keywordMaxScore} pts</div>
          </div>
          <div style={{ padding: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Education</div>
            <div style={{ fontWeight: 700, color: 'var(--success-light)' }}>{report.educationScore}/{report.educationMaxScore} pts</div>
          </div>
        </div>
      </div>

    </div>
  );
}
