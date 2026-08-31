import { useCallback, useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  sublabel?: string;
}

export default function FileUpload({ onFileSelect, accept = '.pdf', label, sublabel }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {selectedFile ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 28
          }}>
            ✓
          </div>
          <div>
            <p style={{ color: 'var(--success-light)', fontWeight: 600, fontSize: '16px' }}>
              {selectedFile.name}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            📄
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px' }}>
              {label || 'Drop your resume here'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
              {sublabel || 'or click to browse • PDF files only'}
            </p>
          </div>
          <div style={{
            display: 'flex', gap: '8px', marginTop: '4px'
          }}>
            <span style={{
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)',
              fontSize: '12px', fontWeight: 500
            }}>PDF</span>
          </div>
        </div>
      )}
    </div>
  );
}
