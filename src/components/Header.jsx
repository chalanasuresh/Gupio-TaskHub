import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Sun,
  Moon,
  Bell,
  Search,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

export default function Header({
  pageTitle = 'Dashboard Overview',
  pageSubtitle = 'Manage, track, and organize team productivity tasks.',
  onOpenSidebar,
  onOpenCreateTask,
  onOpenExport,
  onViewTask,
  globalSearch = '',
  onGlobalSearchChange,
  showSearch = true,
}) {
  const { currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Global Ctrl + K keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('header-global-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-titles">
          <h2 className="header-page-title">{pageTitle}</h2>
          <p className="header-page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      <div className="header-center">
        {showSearch && onGlobalSearchChange && (
          <div className="header-search-bar">
            <Search size={16} className="header-search-icon" />
            <input
              id="header-global-search"
              type="text"
              className="header-search-input"
              placeholder="Search tasks, status, priority..."
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              aria-label="Search tasks across workspace"
            />
            <div className="kbd-shortcut-hint" title="Press Ctrl + K to focus search">
              <span className="kbd-key">Ctrl</span>
              <span className="kbd-key">K</span>
            </div>
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Export Data Button */}
        {onOpenExport && (
          <button
            type="button"
            className="header-icon-btn btn-export-trigger"
            onClick={onOpenExport}
            title="Export tasks (CSV / JSON)"
            aria-label="Export tasks"
          >
            <Download size={18} />
          </button>
        )}

        {/* Theme Toggle Button (Sun / Moon) */}
        <button
          type="button"
          className="header-icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-slate-600" />}
        </button>

        {/* Notifications Center Bell */}
        <div className="header-popover-wrapper">
          <button
            type="button"
            className={`header-icon-btn notif-bell-btn ${isNotifOpen ? 'active' : ''}`}
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              setIsUserMenuOpen(false);
            }}
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="notif-badge-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            onViewTask={onViewTask}
          />
        </div>

        {/* Add Task Primary CTA */}
        {onOpenCreateTask && (
          <button
            type="button"
            className="btn btn-primary btn-add-task"
            onClick={onOpenCreateTask}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        )}

        {/* User Profile Avatar & Dropdown */}
        {currentUser && (
          <div className="header-popover-wrapper">
            <button
              type="button"
              className="header-user-btn"
              onClick={() => {
                setIsUserMenuOpen((prev) => !prev);
                setIsNotifOpen(false);
              }}
              title={`Logged in as ${currentUser.name}`}
              aria-label="Open user menu"
            >
              <div
                className="header-user-avatar"
                style={{ backgroundColor: currentUser.avatarColor || '#2563eb' }}
              >
                {currentUser.avatarInitials || 'U'}
              </div>
              <span className="header-user-name-desktop">{currentUser.name.split(' ')[0]}</span>
            </button>
            <UserDropdown
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
