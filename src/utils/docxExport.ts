import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import type { ResumeDTO, SuggestionDTO } from '../types';

/**
 * Generate and trigger download of a clean ATS-friendly Microsoft Word (.docx) resume.
 */
export async function exportToDocx(resume: ResumeDTO, suggestions?: SuggestionDTO | null, templateName: string = 'ATS_Resume') {
  const children: Paragraph[] = [];

  // 1. Candidate Name
  if (resume.name) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.TITLE,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: resume.name,
            bold: true,
            size: 32, // 16pt
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 2. Contact Information
  const contacts: string[] = [];
  if (resume.email) contacts.push(resume.email);
  if (resume.phone) contacts.push(resume.phone);
  if (resume.location) contacts.push(resume.location);

  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contacts.join('  |  '),
            size: 20, // 10pt
            color: '555555',
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // Helper for Section Headings
  const addSectionHeader = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: 'CCCCCC',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: '1A56A0',
            font: 'Calibri',
          }),
        ],
      })
    );
  };

  // 3. Professional Summary
  const summaryText = suggestions?.improvedSummary || resume.summary;
  if (summaryText) {
    addSectionHeader('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: summaryText,
            size: 21,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 4. Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    addSectionHeader('Technical Skills');
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: resume.skills.join(', '),
            size: 21,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 5. Work Experience
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader('Work Experience');
    for (let i = 0; i < resume.experience.length; i++) {
      const exp = resume.experience[i];
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `${exp.title || 'Role'} — ${exp.company || 'Company'}`,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: exp.duration ? `   (${exp.duration})` : '',
              italics: true,
              size: 20,
              color: '666666',
              font: 'Calibri',
            }),
          ],
        })
      );

      const bullets = exp.bullets || [];
      for (const bullet of bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 21,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // 6. Projects
  if (resume.projects && resume.projects.length > 0) {
    addSectionHeader('Key Projects');
    for (const proj of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: proj.technologies ? `  (${proj.technologies.join(', ')})` : '',
              italics: true,
              size: 20,
              color: '666666',
              font: 'Calibri',
            }),
          ],
        })
      );

      for (const bullet of proj.bullets || []) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 21,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // 7. Education
  if (resume.education) {
    addSectionHeader('Education');
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resume.education,
            size: 21,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 8. Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeader('Certifications & Achievements');
    for (const cert of resume.certifications) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: cert,
              size: 21,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(resume.name || 'resume').replace(/\s+/g, '_')}_${templateName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
