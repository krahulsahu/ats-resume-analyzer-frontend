import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function CompactTechTemplate({ resume }: TemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#000000', fontSize: '10.5px', lineHeight: 1.35 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 2px' }}>
          {resume.name || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '10px', color: '#333333' }}>
          {[resume.email, resume.phone, resume.location].filter(Boolean).join(' | ')}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '3px' }}>
            Summary
          </div>
          <p style={{ margin: 0, textAlign: 'justify', fontSize: '10px' }}>{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '3px' }}>
            Technical Skills
          </div>
          <p style={{ margin: 0, fontSize: '10px' }}>{resume.skills.join(', ')}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '4px' }}>
            Experience
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10.5px' }}>
                <span>{exp.title} — {exp.company}</span>
                <span style={{ fontWeight: 400 }}>{exp.duration || `${exp.years || 0} yrs`}</span>
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: '14px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ fontSize: '10px', marginBottom: '1px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '4px' }}>
            Projects
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontWeight: 700, fontSize: '10px' }}>
                {proj.name} {proj.technologies && <span>({proj.technologies.join(', ')})</span>}
              </div>
              <ul style={{ margin: '1px 0 0', paddingLeft: '14px' }}>
                {proj.bullets?.map((b, j) => (
                  <li key={j} style={{ fontSize: '9.5px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '2px' }}>
            Education
          </div>
          <p style={{ margin: 0, fontSize: '10px' }}>{resume.education}</p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <div style={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', fontSize: '10.5px', marginBottom: '2px' }}>
            Certifications
          </div>
          <ul style={{ margin: 0, paddingLeft: '14px' }}>
            {resume.certifications.map((c, i) => (
              <li key={i} style={{ fontSize: '9.5px' }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
