import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Columns3,
  CalendarDays,
  BarChart3,
  User,
  Settings,
  X,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  isOpen,
  onClose,
  stats,
}) {
  const { currentPath, navigate } = useRouter();
  const { currentUser, logout } = useAuth();

  const primaryNavItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: stats?.total ?? null,
    },
    {
      path: '/board',
      label: 'Kanban Board',
      icon: Columns3,
      badge: null,
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: CalendarDays,
      badge: null,
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  const secondaryNavItems = [
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  function handleNav(path) {
    navigate(path);
    if (window.innerWidth < 1024) onClose();
  }

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
            <p className="brand-subtitle">Productivity Workspace</p>
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

        {/* Primary Navigation */}
        <div className="sidebar-nav-section">
          <div className="sidebar-section-label">WORKSPACE</div>
          <nav className="sidebar-nav-list">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === '/dashboard' && (currentPath === '/' || currentPath === ''));

              return (
                <button
                  key={item.path}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNav(item.path)}
                >
                  <span className="nav-active-pill" />
                  <Icon size={18} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="nav-item-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-section-label" style={{ marginTop: '20px' }}>
            PERSONAL
          </div>
          <nav className="sidebar-nav-list">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNav(item.path)}
                >
                  <span className="nav-active-pill" />
                  <Icon size={18} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {currentUser && (
            <div className="sidebar-user-card">
              <div
                className="sidebar-user-avatar"
                style={{ backgroundColor: currentUser.avatarColor || '#2563eb' }}
              >
                {currentUser.avatarInitials || 'U'}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{currentUser.name}</span>
                <span className="sidebar-user-email">{currentUser.email}</span>
              </div>
              <button
                type="button"
                className="sidebar-user-logout-btn"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
