import MinimalAtsTemplate from './templates/MinimalAtsTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ModernBlueTemplate from './templates/ModernBlueTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import CompactTechTemplate from './templates/CompactTechTemplate';
import HarvardTemplate from './templates/HarvardTemplate';
import type { ResumeDTO } from '../types';

interface A4CanvasProps {
  resume: ResumeDTO;
  templateId: string;
  zoom?: number;
}

export default function A4ResumeCanvas({ resume, templateId, zoom = 1.0 }: A4CanvasProps) {
  const renderTemplate = () => {
    switch (templateId) {
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'modern-blue':
        return <ModernBlueTemplate resume={resume} />;
      case 'two-column':
        return <TwoColumnTemplate resume={resume} />;
      case 'compact':
        return <CompactTechTemplate resume={resume} />;
      case 'harvard':
        return <HarvardTemplate resume={resume} />;
      case 'minimal':
      default:
        return <MinimalAtsTemplate resume={resume} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '24px',
      overflow: 'auto',
    }}>
      {/* Real A4 Page (210mm x 297mm approx 794px x 1123px at 96 DPI) */}
      <div
        id="a4-resume-page"
        className="a4-page-canvas"
        style={{
          width: '794px',
          minHeight: '1123px',
          background: '#ffffff',
          color: '#111827',
          padding: '44px 50px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          boxSizing: 'border-box',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
          position: 'relative',
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
