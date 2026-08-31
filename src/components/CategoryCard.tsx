import { useEffect, useState } from 'react';

interface CategoryCardProps {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  color: string;
  delay?: number;
}

export default function CategoryCard({ name, score, maxScore, icon, color, delay = 0 }: CategoryCardProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 200 + delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const getBarClass = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="category-card animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: `${color}15`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', border: `1px solid ${color}25`
          }}>
            {icon}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
            {name}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color }}>
            {score}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            /{maxScore}
          </span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${getBarClass()}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
}
