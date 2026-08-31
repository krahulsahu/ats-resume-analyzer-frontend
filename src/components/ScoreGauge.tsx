import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  grade?: string;
}

export default function ScoreGauge({
  score,
  maxScore = 100,
  size = 200,
  strokeWidth = 12,
  label = 'ATS Score',
  grade,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round((score / maxScore) * 100);

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / maxScore) * circumference;

  // Animate on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Score color
  const getColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#f97316';
    return '#ef4444';
  };

  const getGradientId = () => `scoreGrad-${size}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} className="score-ring">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getColor()} />
              <stop offset="100%" stopColor={percentage >= 60 ? '#8b5cf6' : getColor()} />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            className="score-ring-bg"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            className="score-ring-progress"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={`url(#${getGradientId()})`}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 8px ${getColor()}40)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: size > 150 ? '42px' : '28px',
            fontWeight: 800,
            color: getColor(),
            lineHeight: 1,
          }}>
            {percentage}
          </span>
          <span style={{
            fontSize: size > 150 ? '14px' : '11px',
            color: 'var(--text-muted)',
            fontWeight: 500,
            marginTop: '2px',
          }}>
            / 100
          </span>
          {grade && (
            <span style={{
              fontSize: '18px',
              fontWeight: 700,
              color: getColor(),
              marginTop: '4px',
              padding: '2px 12px',
              borderRadius: 'var(--radius-full)',
              background: `${getColor()}15`,
              border: `1px solid ${getColor()}30`,
            }}>
              {grade}
            </span>
          )}
        </div>
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
