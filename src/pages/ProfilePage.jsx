import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Save,
  LogOut,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function ProfilePage({ stats, onShowToast }) {
  const { currentUser, updateProfile, logout } = useAuth();
  const { navigate } = useRouter();

  const [name, setName] = useState(currentUser?.name || '');
  const [selectedColor, setSelectedColor] = useState(currentUser?.avatarColor || '#2563eb');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const colorPalette = [
    '#2563eb', // Blue
    '#7c3aed', // Purple
    '#059669', // Emerald
    '#d97706', // Amber
    '#dc2626', // Red
    '#db2777', // Pink
    '#0891b2', // Cyan
    '#475569', // Slate
  ];

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const success = updateProfile({
      name: name.trim(),
      avatarColor: selectedColor,
    });
    setIsSaving(false);

    if (success && onShowToast) {
      onShowToast('Profile updated successfully!', 'success');
    }
  }

  const joinDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'September 2026';

  return (
    <div className="profile-page-wrapper">
      <div className="profile-grid-container">
        {/* Left Column: Avatar & Summary Card */}
        <div className="profile-summary-card">
          <div
            className="profile-large-avatar"
            style={{ backgroundColor: selectedColor }}
          >
            {currentUser.avatarInitials || 'AM'}
          </div>

          <h2 className="profile-display-name">{currentUser.name}</h2>
          <p className="profile-display-email">{currentUser.email}</p>

          <div className="profile-member-badge">
            <Calendar size={14} className="text-muted" />
            <span>Member since {joinDate}</span>
          </div>

          <div className="profile-summary-divider" />

          {/* Quick Metrics */}
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="profile-stat-val">{stats.total}</span>
              <span className="profile-stat-lbl">Total Tasks</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val text-emerald">{stats.completed}</span>
              <span className="profile-stat-lbl">Completed</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val text-blue">{stats.todo + stats.inProgress}</span>
              <span className="profile-stat-lbl">Pending</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val text-emerald">{stats.completionRate}%</span>
              <span className="profile-stat-lbl">Pass Rate</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary-danger btn-profile-logout"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} />
            <span>Log Out of Workspace</span>
          </button>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="profile-edit-card">
          <div className="card-header-clean">
            <h3 className="section-card-title">Edit Personal Details</h3>
            <p className="section-card-desc">
              Manage your display name, email representation, and workspace avatar tint.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="profile-name" className="form-label">
                Display Name
              </label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="profile-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-email" className="form-label">
                Registered Email (Read-Only)
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="profile-email"
                  type="email"
                  className="form-input is-disabled"
                  value={currentUser.email}
                  disabled
                />
              </div>
            </div>

            {/* Avatar Color Tint Selection */}
            <div className="form-group">
              <label className="form-label">
                <Palette size={15} /> Avatar Color Tone
              </label>
              <div className="color-swatch-list">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch-btn ${selectedColor === c ? 'is-selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setSelectedColor(c)}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>

          <div className="profile-security-notice">
            <ShieldCheck size={18} className="text-emerald" />
            <div>
              <p className="security-notice-title">Local Browser Persistence</p>
              <p className="security-notice-desc">
                Your profile settings, preferences, and personal tasks are saved directly in your browser's local sandbox storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
