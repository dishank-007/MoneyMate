import React from 'react';

export const KpiCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendType = 'positive', 
  icon: Icon, 
  color = 'primary',
  progress
}) => {
  const colorMap = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary-dark)', iconColor: 'var(--primary)' },
    gold: { bg: 'var(--accent-gold-light)', text: '#92400E', iconColor: 'var(--accent-gold)' },
    blue: { bg: 'var(--accent-blue-light)', text: '#1E40AF', iconColor: 'var(--accent-blue)' },
    purple: { bg: 'var(--accent-purple-light)', text: '#5B21B6', iconColor: 'var(--accent-purple)' },
    red: { bg: 'var(--accent-red-light)', text: '#991B1B', iconColor: 'var(--accent-red)' },
  };

  const currentTheme = colorMap[color] || colorMap.primary;

  return (
    <div className="card kpi-card">
      <div className="kpi-top">
        <div className="kpi-info">
          <span className="kpi-title">{title}</span>
          <h3 className="kpi-value">{value}</h3>
        </div>
        {Icon && (
          <div className="kpi-icon-box" style={{ background: currentTheme.bg }}>
            <Icon size={22} color={currentTheme.iconColor} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="kpi-bottom">
          {trend && (
            <span className={`kpi-trend ${trendType}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
        </div>
      )}

      {progress !== undefined && (
        <div className="kpi-progress-wrap">
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-bar" 
              style={{ 
                width: `${Math.min(100, Math.max(0, progress))}%`,
                background: currentTheme.iconColor
              }} 
            />
          </div>
          <span className="kpi-progress-label">{Math.round(progress)}% Used</span>
        </div>
      )}

      <style>{`
        .kpi-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-neu);
        }
        .kpi-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .kpi-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .kpi-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .kpi-value {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .kpi-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-bottom {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .kpi-trend {
          font-size: 0.775rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .kpi-trend.positive {
          background: #DCFCE7;
          color: #15803D;
        }
        .kpi-trend.negative {
          background: #FEE2E2;
          color: #B91C1C;
        }
        .kpi-trend.neutral {
          background: #F1F5F9;
          color: #475569;
        }
        .kpi-subtitle {
          font-size: 0.775rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .kpi-progress-wrap {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .kpi-progress-track {
          flex: 1;
          height: 6px;
          background: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }
        .kpi-progress-bar {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.4s ease;
        }
        .kpi-progress-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
