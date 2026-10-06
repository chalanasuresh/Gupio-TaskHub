import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Database,
  RotateCcw,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  stats,
  onResetDataClick,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      count: null,
      filter: null,
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: Layers,
      count: stats.total,
      filter: 'All',
    },
    {
      id: 'due-today',
      label: 'Due Today',
      icon: Clock,
      count: null, // will filter to due today
      filter: 'Due Today',
      highlight: 'blue',
    },
    {
      id: 'overdue',
      label: 'Overdue Tasks',
      icon: AlertTriangle,
      count: stats.overdue,
      filter: 'Overdue',
      highlight: stats.overdue > 0 ? 'rose' : null,
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      icon: CheckSquare,
      count: stats.inProgress,
      filter: 'In Progress',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: stats.completed,
      filter: 'Completed',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop-mobile"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open-mobile' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="brand-logo-icon">
            <Sparkles size={22} className="text-brand-accent" />
          </div>
          <div className="brand-text-block">
            <h1 className="brand-title">Gupio TaskHub</h1>
            <p className="brand-subtitle">Task Management Dashboard</p>
          </div>
          <button
            type="button"
            className="sidebar-close-mobile-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Assignment disclaimer pill */}
        <div className="sidebar-badge-container">
          <div className="assignment-badge">
            <span className="badge-dot" />
            <span>Placement Assignment • Option 1</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="sidebar-nav-section">
          <div className="sidebar-section-label">WORKSPACE VIEWS</div>
          <nav className="sidebar-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onViewChange(item.id, item.filter);
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <Icon size={18} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                  {item.count !== null && item.count !== undefined && (
                    <span
                      className={`nav-item-badge ${
                        item.highlight ? `badge-${item.highlight}` : ''
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / System Status */}
        <div className="sidebar-footer">
          <div className="system-status-card">
            <div className="system-status-header">
              <Database size={15} className="text-emerald" />
              <span className="system-status-title">Local Storage Layer</span>
            </div>
            <p className="system-status-desc">
              Data persists automatically to browser <code className="code-key">gupio_tasks</code>.
            </p>
            <button
              type="button"
              className="btn-sidebar-action"
              onClick={onResetDataClick}
              title="Restore initial sample tasks"
            >
              <RotateCcw size={14} />
              <span>Reset Sample Tasks</span>
            </button>
          </div>

          <div className="sidebar-credit">
            <span>Gupio Frontend Placement</span>
            <span className="sidebar-version">v1.0.0 • Local Only</span>
          </div>
        </div>
      </aside>
    </>
  );
}
