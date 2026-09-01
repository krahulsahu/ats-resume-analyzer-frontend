import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function ExecutiveTemplate({ resume }: TemplateProps) {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e293b', fontSize: '12px', lineHeight: 1.45 }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '0.2px' }}>
          {resume.name || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '12px', fontFamily: 'Arial, sans-serif' }}>
          {resume.email && <span><strong>Email:</strong> {resume.email}</span>}
          {resume.phone && <span><strong>Tel:</strong> {resume.phone}</span>}
          {resume.location && <span><strong>Location:</strong> {resume.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Executive Profile
          </div>
          <p style={{ margin: 0, color: '#334155', fontSize: '11.5px', textAlign: 'justify' }}>
            {resume.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Core Competencies & Technologies
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontFamily: 'Arial, sans-serif' }}>
            {resume.skills.map(skill => (
              <span key={skill} style={{ background: '#e2e8f0', color: '#1e293b', padding: '2px 8px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 600 }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Professional Experience
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>{exp.title}</span>
                <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>{exp.duration || `${exp.years || 0} yrs`}</span>
              </div>
              {exp.company && <div style={{ fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>{exp.company}</div>}
              <ul style={{ margin: '3px 0 0', paddingLeft: '18px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#334155', marginBottom: '3px', fontSize: '11px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Selected Key Projects
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>
                {proj.name} {proj.technologies && <span style={{ fontWeight: 500, fontSize: '10.5px', color: '#64748b' }}>[{proj.technologies.join(', ')}]</span>}
              </div>
              <ul style={{ margin: '3px 0 0', paddingLeft: '18px' }}>
                {proj.bullets?.map((b, j) => (
                  <li key={j} style={{ color: '#334155', marginBottom: '2px', fontSize: '11px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Education & Academic Background
          </div>
          <p style={{ margin: 0, color: '#334155', fontSize: '11.5px' }}>{resume.education}</p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <div style={{ background: '#f1f5f9', padding: '3px 8px', fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Executive Certifications & Credentials
          </div>
          <ul style={{ margin: '3px 0 0', paddingLeft: '18px' }}>
            {resume.certifications.map((c, i) => (
              <li key={i} style={{ color: '#334155', marginBottom: '2px', fontSize: '11px' }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
