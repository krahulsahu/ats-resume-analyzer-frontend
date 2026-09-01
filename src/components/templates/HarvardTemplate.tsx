import type { ResumeDTO } from '../../types';

interface TemplateProps {
  resume: ResumeDTO;
}

export default function HarvardTemplate({ resume }: TemplateProps) {
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, Georgia, serif', color: '#000000', fontSize: '11.5px', lineHeight: 1.4 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '1px' }}>
          {resume.name || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '11px', color: '#333333' }}>
          {[resume.location, resume.phone, resume.email].filter(Boolean).join('  \u2022  ')}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, textAlign: 'justify', fontSize: '11px' }}>{resume.summary}</p>
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Education
          </h2>
          <p style={{ margin: 0, fontSize: '11px' }}>{resume.education}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '6px', letterSpacing: '0.5px' }}>
            Experience
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11.5px' }}>
                <span>{exp.company}</span>
                <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{exp.duration || `${exp.years || 0} yrs`}</span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '11px', marginBottom: '2px' }}>
                {exp.title}
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: '16px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ fontSize: '11px', marginBottom: '1.5px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '6px', letterSpacing: '0.5px' }}>
            Projects & Research
          </h2>
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11px' }}>
                {proj.name} {proj.technologies && <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>— {proj.technologies.join(', ')}</span>}
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: '16px' }}>
                {proj.bullets?.map((b, j) => (
                  <li key={j} style={{ fontSize: '10.5px', marginBottom: '1.5px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Technical Skills & Interests
          </h2>
          <p style={{ margin: 0, fontSize: '11px' }}>
            <strong>Skills:</strong> {resume.skills.join(', ')}
          </p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11.5px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '1px', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Honors & Certifications
          </h2>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {resume.certifications.map((c, i) => (
              <li key={i} style={{ fontSize: '10.5px', marginBottom: '1.5px' }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
