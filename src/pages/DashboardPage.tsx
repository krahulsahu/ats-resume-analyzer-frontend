import { useNavigate } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie,
} from 'recharts';
import ParticleBackground from '../components/ParticleBackground';
import ScoreGauge from '../components/ScoreGauge';
import type { AtsReportDTO } from '../types';

interface DashboardPageProps {
  report: AtsReportDTO | null;
}

export default function DashboardPage({ report }: DashboardPageProps) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>No Dashboard Data</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Upload and analyze a resume first to see the dashboard.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            📄 Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const categoryData = [
    { name: 'Skills', score: report.skillScore, maxScore: report.skillMaxScore, fill: '#6366f1' },
    { name: 'Experience', score: report.experienceScore, maxScore: report.experienceMaxScore, fill: '#8b5cf6' },
    { name: 'Keywords', score: report.keywordScore, maxScore: report.keywordMaxScore, fill: '#06b6d4' },
    { name: 'Education', score: report.educationScore, maxScore: report.educationMaxScore, fill: '#10b981' },
    { name: 'Location', score: report.locationScore, maxScore: report.locationMaxScore, fill: '#f59e0b' },
    { name: 'Notice', score: report.noticeScore, maxScore: report.noticeMaxScore, fill: '#f97316' },
  ];

  const barData = categoryData.map(d => ({
    name: d.name,
    percentage: d.maxScore > 0 ? Math.round((d.score / d.maxScore) * 100) : 0,
    score: d.score,
    fill: d.fill,
  }));

  const skillPieData = [
    { name: 'Matched', value: report.matchedSkills.length, fill: '#10b981' },
    { name: 'Missing', value: report.missingSkills.length, fill: '#ef4444' },
  ];

  const radialData = [
    {
      name: 'Score',
      value: report.overallScore,
      fill: report.overallScore >= 80 ? '#10b981' : report.overallScore >= 60 ? '#f59e0b' : '#ef4444',
    },
  ];

  const statCards = [
    { label: 'ATS Score', value: `${report.overallScore}%`, icon: '🎯', color: '#6366f1', sub: `Grade: ${report.grade}` },
    { label: 'Skills Match', value: `${report.matchedSkills.length}/${report.matchedSkills.length + report.missingSkills.length}`, icon: '✅', color: '#10b981', sub: `${report.skillScore}/${report.skillMaxScore} pts` },
    { label: 'Missing Skills', value: report.missingSkills.length.toString(), icon: '❌', color: '#ef4444', sub: 'To improve' },
    { label: 'Keywords', value: Object.keys(report.keywordDensity).length.toString(), icon: '🔑', color: '#06b6d4', sub: `${report.keywordScore}/${report.keywordMaxScore} pts` },
  ];

  return (
    <div className="gradient-bg" style={{ position: 'relative' }}>
      <ParticleBackground />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Title */}
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800,
            background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
            backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {report.resume?.name} {report.job?.title && `• ${report.job.title}`}
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px', marginBottom: '24px',
        }}>
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className="glass-card animate-fade-in"
              style={{ padding: '24px', animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 800, color: card.color }}>
                    {card.value}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                    {card.sub}
                  </p>
                </div>
                <span style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: `${card.color}12`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', border: `1px solid ${card.color}20`,
                }}>
                  {card.icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Score Gauge */}
          <div className="glass-card animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', alignSelf: 'flex-start' }}>
              Overall ATS Score
            </h3>
            <ScoreGauge score={report.overallScore} grade={report.grade} size={180} />
          </div>

          {/* Category Bar Chart */}
          <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={80}
                  tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e1e3f', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: '#e2e8f0', fontSize: '13px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Score']}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={16}>
                  {barData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Skill Pie */}
          <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
              Skills Distribution
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={skillPieData}
                    dataKey="value"
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {skillPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '16px' }}>
                {skillPieData.map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.fill }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {item.name}: <strong>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radial Score */}
          <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
              Score Radar
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="40%"
                outerRadius="90%"
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background={{ fill: 'rgba(255,255,255,0.04)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '-20px' }}>
              {report.overallScore}/100 — {report.grade} Grade
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/results')}>
            📋 View Full Report
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            🔄 New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
