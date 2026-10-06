import React, { useState } from 'react';
import {
  Sun,
  Moon,
  LayoutGrid,
  List,
  Columns3,
  Download,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  Bell,
  Sliders,
  Database,
  Palette,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  exportTasksToCSV,
  exportTasksToJSON,
  loadPreferencesFromStorage,
  savePreferencesToStorage,
} from '../utils/storage';

export default function SettingsPage({
  tasks = [],
  onResetTasks,
  onClearAllTasks,
  onShowToast,
}) {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('appearance');
  const [prefs, setPrefs] = useState(() => loadPreferencesFromStorage());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handlePrefChange(key, val) {
    const updated = { ...prefs, [key]: val };
    setPrefs(updated);
    savePreferencesToStorage(updated);
    if (onShowToast) onShowToast('Preference updated', 'info', 1800);
  }

  function handleExportCSV() {
    exportTasksToCSV(tasks);
    if (onShowToast) onShowToast(`Exported ${tasks.length} tasks to CSV`, 'success');
  }

  function handleExportJSON() {
    exportTasksToJSON(tasks);
    if (onShowToast) onShowToast(`Exported ${tasks.length} tasks to JSON`, 'success');
  }

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Task Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
  ];

  return (
    <div className="settings-page-wrapper">
      <div className="settings-two-column-layout">
        {/* Left: Settings Navigation Menu */}
        <aside className="settings-nav-sidebar" aria-label="Settings navigation">
          <div className="settings-nav-header">
            <h3 className="settings-nav-title">Settings</h3>
            <p className="settings-nav-subtitle">System & workspace options</p>
          </div>
          <nav className="settings-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`settings-nav-btn ${isActive ? 'active' : ''} ${
                    item.isDanger ? 'btn-danger-nav' : ''
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right: Settings Content Panels */}
        <div className="settings-content-area">
          {/* Section 1: Appearance */}
          {(activeTab === 'appearance' || activeTab === 'all') && (
            <div className="settings-card" id="section-appearance">
              <div className="settings-card-header">
                <h3 className="settings-section-title">Appearance & Theme</h3>
                <p className="settings-section-desc">
                  Choose your interface theme. Designed for optimal focus in both light and dark environments.
                </p>
              </div>

              <div className="theme-selector-grid">
                {/* Light Mode Card */}
                <div
                  className={`theme-preview-card ${theme === 'light' ? 'is-selected' : ''}`}
                  onClick={() => setTheme('light')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="theme-preview-box light-preview">
                    <Sun size={24} className="text-amber-500" />
                    <div className="preview-lines">
                      <div className="preview-line-bar" />
                      <div className="preview-line-bar w-75" />
                    </div>
                  </div>
                  <div className="theme-card-footer">
                    <span className="theme-name">Light Mode</span>
                    {theme === 'light' && <Check size={16} className="text-primary" />}
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div
                  className={`theme-preview-card ${theme === 'dark' ? 'is-selected' : ''}`}
                  onClick={() => setTheme('dark')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="theme-preview-box dark-preview">
                    <Moon size={24} className="text-blue-400" />
                    <div className="preview-lines">
                      <div className="preview-line-bar dark" />
                      <div className="preview-line-bar dark w-75" />
                    </div>
                  </div>
                  <div className="theme-card-footer">
                    <span className="theme-name">Dark Mode</span>
                    {theme === 'dark' && <Check size={16} className="text-primary" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Task Preferences */}
          {(activeTab === 'preferences' || activeTab === 'all') && (
            <div className="settings-card" id="section-preferences">
              <div className="settings-card-header">
                <h3 className="settings-section-title">Task Preferences</h3>
                <p className="settings-section-desc">
                  Select your default workspace layout and display mode.
                </p>
              </div>

              <div className="settings-form-list">
                <div className="settings-row">
                  <div>
                    <label className="settings-label">Default Task View</label>
                    <p className="settings-subtext">Presentation mode when visiting task views.</p>
                  </div>
                  <div className="default-view-pills">
                    <button
                      type="button"
                      className={`pref-pill-btn ${prefs.defaultView === 'grid' ? 'active' : ''}`}
                      onClick={() => handlePrefChange('defaultView', 'grid')}
                    >
                      <LayoutGrid size={14} />
                      <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      className={`pref-pill-btn ${prefs.defaultView === 'table' ? 'active' : ''}`}
                      onClick={() => handlePrefChange('defaultView', 'table')}
                    >
                      <List size={14} />
                      <span>Table</span>
                    </button>
                    <button
                      type="button"
                      className={`pref-pill-btn ${prefs.defaultView === 'board' ? 'active' : ''}`}
                      onClick={() => handlePrefChange('defaultView', 'board')}
                    >
                      <Columns3 size={14} />
                      <span>Kanban</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Notifications */}
          {(activeTab === 'notifications' || activeTab === 'all') && (
            <div className="settings-card" id="section-notifications">
              <div className="settings-card-header">
                <h3 className="settings-section-title">Notification Preferences</h3>
                <p className="settings-section-desc">
                  Configure alerts for approaching due dates and overdue tasks.
                </p>
              </div>

              <div className="settings-form-list">
                <div className="settings-row">
                  <div>
                    <label className="settings-label">Overdue & Deadline Alerts</label>
                    <p className="settings-subtext">Display notifications for tasks due today or overdue.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={prefs.overdueAlerts}
                      onChange={(e) => handlePrefChange('overdueAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Data Management & Export */}
          {(activeTab === 'data' || activeTab === 'all') && (
            <div className="settings-card" id="section-data">
              <div className="settings-card-header">
                <h3 className="settings-section-title">Data Management & Export</h3>
                <p className="settings-section-desc">
                  Export tasks to standard file formats or reset sample demonstration data.
                </p>
              </div>

              <div className="data-actions-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleExportCSV}
                >
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleExportJSON}
                >
                  <Download size={15} />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResetConfirm(true)}
                >
                  <RotateCcw size={15} />
                  <span>Reset Sample Tasks</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 5: Danger Zone */}
          {(activeTab === 'danger' || activeTab === 'all') && (
            <div className="settings-card danger-card" id="section-danger">
              <div className="settings-card-header">
                <div className="danger-header-title">
                  <AlertTriangle size={18} className="text-danger" />
                  <h3 className="settings-section-title text-danger">Danger Zone</h3>
                </div>
                <p className="settings-section-desc">
                  Irreversible actions that clear all tasks from local browser storage.
                </p>
              </div>

              <div className="danger-action-row">
                <div>
                  <strong className="danger-item-title">Delete All Tasks</strong>
                  <p className="settings-subtext">Permanently purge all {tasks.length} tasks from your account.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowClearConfirm(true)}
                >
                  <Trash2 size={15} />
                  <span>Clear All Tasks</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Resetting */}
      {showResetConfirm && (
        <div className="modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Reset to Sample Tasks</h3>
            <p className="confirm-message">
              This will reset your current tasks to the 8 standard demo tasks. Continue?
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onResetTasks();
                  setShowResetConfirm(false);
                  if (onShowToast) onShowToast('Sample tasks restored', 'success');
                }}
              >
                Reset Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Purging */}
      {showClearConfirm && (
        <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title text-danger">Purge All Tasks?</h3>
            <p className="confirm-message">
              Are you sure you want to permanently delete all {tasks.length} tasks? This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onClearAllTasks();
                  setShowClearConfirm(false);
                  if (onShowToast) onShowToast('All tasks cleared', 'warning');
                }}
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
