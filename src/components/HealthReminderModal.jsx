import React, { useState } from 'react';
import { X, Bell, Clock, Calendar, Tag, FileText } from 'lucide-react';

export default function HealthReminderModal({
  isOpen,
  onClose,
  reminderToEdit = null,
  onSave,
}) {
  const isEditing = Boolean(reminderToEdit);

  const [formData, setFormData] = useState(() => {
    if (reminderToEdit) {
      return {
        name: reminderToEdit.name || '',
        description: reminderToEdit.description || '',
        time: reminderToEdit.time || '08:00 AM',
        date: reminderToEdit.date || new Date().toISOString().split('T')[0],
        frequency: reminderToEdit.frequency || 'Daily',
        category: reminderToEdit.category || 'Medication',
      };
    }
    return {
      name: '',
      description: '',
      time: '08:00 PM',
      date: new Date().toISOString().split('T')[0],
      frequency: 'Daily',
      category: 'Medication',
    };
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Reminder name is required.');
      return;
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      time: formData.time,
      date: formData.date,
      frequency: formData.frequency,
      category: formData.category,
    });

    onClose();
  }

  const categories = ['Medication', 'Water', 'Exercise', 'General Wellness'];
  const frequencies = ['Daily', 'Weekdays', 'Weekly', 'Once'];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container health-reminder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {isEditing ? 'Edit Health Reminder' : 'Add Health Reminder'}
            </h3>
            <p className="modal-subtitle">Keep important daily wellness reminders organized.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" noValidate>
          {error && <div className="auth-alert-error">{error}</div>}

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="rem-name">
              <Bell size={14} className="text-teal" /> Reminder Name *
            </label>
            <div className="auth-input-wrapper">
              <input
                id="rem-name"
                type="text"
                className="form-input"
                placeholder="e.g. Vitamin tablet, Drink water, Afternoon walk"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Category & Frequency Row */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="rem-cat">
                <Tag size={14} className="text-teal" /> Category
              </label>
              <select
                id="rem-cat"
                className="filter-select"
                style={{ width: '100%', height: '36px' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rem-freq">
                Frequency
              </label>
              <select
                id="rem-freq"
                className="filter-select"
                style={{ width: '100%', height: '36px' }}
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                {frequencies.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time & Date Row */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="rem-time">
                <Clock size={14} className="text-teal" /> Time
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="rem-time"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 08:00 PM or 2:30 PM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rem-date">
                <Calendar size={14} className="text-teal" /> Date
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="rem-date"
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Optional Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="rem-desc">
              <FileText size={14} className="text-muted" /> Optional Note / Description
            </label>
            <div className="auth-input-wrapper">
              <input
                id="rem-desc"
                type="text"
                className="form-input"
                placeholder="e.g. Take with dinner and water"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '10px 0 0', border: 'none' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-health-submit">
              {isEditing ? 'Save Changes' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
