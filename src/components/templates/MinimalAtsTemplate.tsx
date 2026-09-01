import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function MinimalAtsTemplate({ resume }: TemplateProps) {
  return (
    <div style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif', color: '#111827', fontSize: '12.5px', lineHeight: 1.4 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px', color: '#0f172a' }}>
          {resume.name || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '11px', color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>• {resume.phone}</span>}
          {resume.location && <span>• {resume.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, color: '#1f2937', textAlign: 'justify', fontSize: '12px' }}>
            {resume.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '6px' }}>
            Technical Skills
          </h2>
          <p style={{ margin: 0, color: '#1f2937', fontSize: '12px' }}>
            {resume.skills.join(', ')}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '8px' }}>
            Work Experience
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px', color: '#111827' }}>
                <span>{exp.title} {exp.company && `— ${exp.company}`}</span>
                <span style={{ fontWeight: 500, color: '#4b5563', fontStyle: 'italic' }}>{exp.duration || `${exp.years || 0} yrs`}</span>
              </div>
              <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#374151', marginBottom: '2px', fontSize: '11.5px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '8px' }}>
            Key Projects
          </h2>
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#111827' }}>
                {proj.name} {proj.technologies && <span style={{ fontWeight: 500, fontStyle: 'italic', color: '#4b5563' }}>({proj.technologies.join(', ')})</span>}
              </div>
              <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
                {proj.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#374151', marginBottom: '2px', fontSize: '11.5px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '4px' }}>
            Education
          </h2>
          <p style={{ margin: 0, color: '#1f2937', fontSize: '12px' }}>{resume.education}</p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', borderBottom: '1px solid #1e3a8a', paddingBottom: '2px', marginBottom: '4px' }}>
            Certifications & Achievements
          </h2>
          <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
            {resume.certifications.map((c, i) => (
              <li key={i} style={{ color: '#374151', marginBottom: '2px', fontSize: '11.5px' }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
