import React from 'react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default', // 'default' | 'todo' | 'progress' | 'completed' | 'high'
  subtext,
  isActive = false,
  onClick,
}) {
  return (
    <div
      className={`stat-card stat-card-${variant} ${isActive ? 'is-active' : ''} ${
        onClick ? 'is-clickable' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isActive : undefined}
    >
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div className={`stat-icon-wrap stat-icon-${variant}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-bottom">
        <div className="stat-card-value">{value}</div>
        {subtext && <div className="stat-card-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
