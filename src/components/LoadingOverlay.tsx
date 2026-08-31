interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingOverlay({
  message = 'Analyzing Resume...',
  subMessage = 'Running ATS scoring engine and parsing resume sections'
}: LoadingOverlayProps) {
  return (
    <div className="loading-overlay">
      {/* Animated rings */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid transparent',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: '8px',
          border: '3px solid transparent',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: '16px',
          border: '3px solid transparent',
          borderTopColor: 'var(--info)',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute', inset: '50%',
          width: 8, height: 8, marginLeft: -4, marginTop: -4,
          background: 'var(--primary)', borderRadius: '50%',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p className="loading-text" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {message}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          {subMessage}
        </p>
      </div>

      {/* Processing steps */}
      <div style={{
        display: 'flex', gap: '24px', marginTop: '16px',
        flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {['Parsing PDF', 'Extracting Skills', 'Scoring Match', 'Generating Report'].map((step, i) => (
          <div key={step} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            opacity: 0, animation: `fadeInUp 0.5s ease-out forwards`,
            animationDelay: `${i * 0.3}s`,
          }}>
            <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
