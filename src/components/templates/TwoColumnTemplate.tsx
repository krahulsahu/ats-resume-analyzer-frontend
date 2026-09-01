import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function TwoColumnTemplate({ resume }: TemplateProps) {
  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', color: '#1e293b', fontSize: '11px', lineHeight: 1.4 }}>
      {/* Top Bar Header */}
      <div style={{ background: '#0f172a', color: '#ffffff', padding: '16px 20px', borderRadius: '4px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px', letterSpacing: '0.5px' }}>
          {resume.name || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {resume.email && <span>✉ {resume.email}</span>}
          {resume.phone && <span>☎ {resume.phone}</span>}
          {resume.location && <span>📍 {resume.location}</span>}
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '18px' }}>
        {/* Left Column: Skills, Education, Certifications */}
        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '14px' }}>
          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '8px' }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {resume.skills.map(skill => (
                  <span key={skill} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '3px', fontSize: '10.5px', color: '#334155' }}>
                    • {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '6px' }}>
                Education
              </h2>
              <p style={{ margin: 0, color: '#475569', fontSize: '10.5px', lineHeight: 1.35 }}>{resume.education}</p>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '6px' }}>
                Awards
              </h2>
              <ul style={{ margin: 0, paddingLeft: '14px', color: '#475569', fontSize: '10.5px' }}>
                {resume.certifications.map((c, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Summary, Experience, Projects */}
        <div>
          {/* Summary */}
          {resume.summary && (
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '6px' }}>
                Professional Profile
              </h2>
              <p style={{ margin: 0, color: '#334155', textAlign: 'justify', fontSize: '11px' }}>
                {resume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '8px' }}>
                Work History
              </h2>
              {resume.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11.5px', color: '#0f172a' }}>
                    <span>{exp.title} {exp.company && `— ${exp.company}`}</span>
                    <span style={{ fontWeight: 500, color: '#64748b', fontSize: '10.5px' }}>{exp.duration || `${exp.years || 0} yrs`}</span>
                  </div>
                  <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
                    {exp.bullets?.map((b, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '2px', fontSize: '10.5px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '2px', marginBottom: '6px' }}>
                Featured Projects
              </h2>
              {resume.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#0f172a' }}>
                    {proj.name} {proj.technologies && <span style={{ fontWeight: 500, color: '#64748b', fontSize: '10px' }}>({proj.technologies.join(', ')})</span>}
                  </div>
                  <ul style={{ margin: '2px 0 0', paddingLeft: '16px' }}>
                    {proj.bullets?.map((b, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '2px', fontSize: '10.5px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
