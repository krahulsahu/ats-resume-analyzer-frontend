import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function ModernBlueTemplate({ resume }: TemplateProps) {
  const ACCENT_COLOR = '#0284c7'; // Sky 600

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', color: '#1e293b', fontSize: '11.5px', lineHeight: 1.45 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${ACCENT_COLOR}`, paddingBottom: '12px', marginBottom: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>
            {resume.name || 'Candidate Name'}
          </h1>
          <div style={{ color: ACCENT_COLOR, fontWeight: 700, fontSize: '12px' }}>
            ATS Optimized Professional
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
          {resume.email && <div>{resume.email}</div>}
          {resume.phone && <div>{resume.phone}</div>}
          {resume.location && <div>{resume.location}</div>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>
            Summary
          </h2>
          <p style={{ margin: 0, color: '#334155', textAlign: 'justify', fontSize: '11px' }}>
            {resume.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>
            Technical Expertise
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {resume.skills.map(skill => (
              <span key={skill} style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>
            Experience
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11.5px', color: '#0f172a' }}>
                <span>{exp.title} <span style={{ fontWeight: 500, color: '#64748b' }}>at {exp.company}</span></span>
                <span style={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: '10.5px' }}>{exp.duration || `${exp.years || 0} yrs`}</span>
              </div>
              <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#475569', marginBottom: '2px', fontSize: '11px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>
            Key Projects
          </h2>
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '11.5px', color: '#0f172a' }}>
                {proj.name} {proj.technologies && <span style={{ fontWeight: 500, color: '#64748b', fontSize: '10.5px' }}>— {proj.technologies.join(', ')}</span>}
              </div>
              <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
                {proj.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#475569', marginBottom: '2px', fontSize: '11px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>
            Education
          </h2>
          <p style={{ margin: 0, color: '#334155', fontSize: '11px' }}>{resume.education}</p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11.5px', fontWeight: 800, color: ACCENT_COLOR, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>
            Certifications
          </h2>
          <ul style={{ margin: '2px 0 0', paddingLeft: '16px' }}>
            {resume.certifications.map((c, i) => (
              <li key={i} style={{ color: '#475569', marginBottom: '2px', fontSize: '11px' }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
