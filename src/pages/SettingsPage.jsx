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

  return (
    <div className="settings-page-wrapper">
      <div className="settings-sections-list">
        {/* Section 1: Appearance */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="settings-section-title">Appearance & Theme</h3>
            <p className="settings-section-desc">
              Select how Gupio TaskHub looks to you. Choose between clean light and dark SaaS modes.
            </p>
          </div>

          <div className="theme-selector-grid">
            {/* Light Mode Card */}
            <div
              className={`theme-preview-card ${theme === 'light' ? 'is-selected' : ''}`}
              onClick={() => setTheme('light')}
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

        {/* Section 2: Workspace Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="settings-section-title">Workspace Preferences</h3>
            <p className="settings-section-desc">
              Configure your default view layout and alert settings.
            </p>
          </div>

          <div className="settings-form-list">
            <div className="settings-row">
              <div>
                <label className="settings-label">Default Task View</label>
                <p className="settings-subtext">Choose your preferred default task presentation style.</p>
              </div>
              <div className="default-view-pills">
                <button
                  type="button"
                  className={`pref-pill-btn ${prefs.defaultView === 'grid' ? 'active' : ''}`}
                  onClick={() => handlePrefChange('defaultView', 'grid')}
                >
                  <LayoutGrid size={15} />
                  <span>Grid Cards</span>
                </button>
                <button
                  type="button"
                  className={`pref-pill-btn ${prefs.defaultView === 'table' ? 'active' : ''}`}
                  onClick={() => handlePrefChange('defaultView', 'table')}
                >
                  <List size={15} />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  className={`pref-pill-btn ${prefs.defaultView === 'board' ? 'active' : ''}`}
                  onClick={() => handlePrefChange('defaultView', 'board')}
                >
                  <Columns3 size={15} />
                  <span>Kanban</span>
                </button>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <label className="settings-label">Overdue & Deadline Alerts</label>
                <p className="settings-subtext">Display prominent notification center warnings for overdue tasks.</p>
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

        {/* Section 3: Data Management & Export */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="settings-section-title">Data Management & Export</h3>
            <p className="settings-section-desc">
              Download your workspace data locally or restore realistic demonstration fixtures.
            </p>
          </div>

          <div className="data-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportCSV}
            >
              <Download size={16} />
              <span>Export as CSV</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportJSON}
            >
              <Download size={16} />
              <span>Export as JSON</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={16} />
              <span>Reset Sample Tasks</span>
            </button>
          </div>
        </div>

        {/* Section 4: Danger Zone */}
        <div className="settings-card danger-card">
          <div className="settings-card-header">
            <div className="danger-header-title">
              <AlertTriangle size={18} className="text-danger" />
              <h3 className="settings-section-title text-danger">Danger Zone</h3>
            </div>
            <p className="settings-section-desc">
              Irreversible actions that purge task records permanently from browser storage.
            </p>
          </div>

          <div className="danger-action-row">
            <div>
              <strong className="danger-item-title">Delete all tasks</strong>
              <p className="settings-subtext">Permanently purge all {tasks.length} tasks from your local account.</p>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 size={16} />
              <span>Clear All Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Resetting */}
      {showResetConfirm && (
        <div className="modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Reset to Sample Tasks</h3>
            <p className="confirm-message">
              This will overwrite your existing tasks with 8 fresh workplace demo tasks. Continue?
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
              Are you sure you want to permanently delete all {tasks.length} tasks? This action cannot be undone.
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
