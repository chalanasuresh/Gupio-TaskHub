import React, { useState } from 'react';
import {
  Plus,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  HeartPulse,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import HealthReminderModal from '../components/HealthReminderModal';

export default function HealthPage({
  reminders = [],
  onCreateReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleReminder,
  onResetReminders,
  onShowToast,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Medication', 'Water', 'Exercise', 'General Wellness'];

  const filteredReminders = reminders.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const completedCount = reminders.filter((r) => r.completed).length;
  const pendingCount = reminders.length - completedCount;
  const adherenceRate = reminders.length > 0 ? Math.round((completedCount / reminders.length) * 100) : 0;

  function handleSave(data) {
    if (reminderToEdit) {
      onUpdateReminder(reminderToEdit.id, data);
      if (onShowToast) onShowToast(`Reminder "${data.name}" updated.`, 'success');
      setReminderToEdit(null);
    } else {
      onCreateReminder(data);
      if (onShowToast) onShowToast(`Reminder "${data.name}" created.`, 'success');
    }
  }

  function handleToggle(r) {
    const res = onToggleReminder(r.id);
    if (onShowToast) {
      onShowToast(
        res.completed ? `Marked "${r.name}" as taken.` : `Marked "${r.name}" as pending.`,
        'info'
      );
    }
  }

  function handleDelete(r) {
    onDeleteReminder(r.id);
    if (onShowToast) onShowToast(`Deleted reminder "${r.name}".`, 'warning');
  }

  function getCategoryEmoji(cat) {
    switch (cat) {
      case 'Medication':
        return '💊';
      case 'Water':
        return '💧';
      case 'Exercise':
        return '🏃';
      case 'General Wellness':
      default:
        return '🌿';
    }
  }

  return (
    <div className="health-page-container">
      {/* Top Banner Header */}
      <section className="health-header-card">
        <div className="health-header-left">
          <div className="health-brand-badge">
            <HeartPulse size={15} className="text-teal" />
            <span>Wellness Support</span>
          </div>
          <h2 className="health-page-title">Health Reminders</h2>
          <p className="health-page-desc">
            Keep your daily wellness habits, hydration, and medication reminders organized alongside your work.
          </p>
        </div>

        <div className="health-header-right">
          <button
            type="button"
            className="btn btn-primary btn-health-add"
            onClick={() => {
              setReminderToEdit(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Reminder</span>
          </button>
        </div>
      </section>

      {/* Quick Metrics Strip */}
      <section className="health-metrics-strip" aria-label="Reminder metrics">
        <div className="health-metric-tile teal">
          <div className="health-metric-icon">
            <HeartPulse size={18} />
          </div>
          <div className="health-metric-info">
            <span className="health-metric-lbl">Total Habits</span>
            <span className="health-metric-val">{reminders.length}</span>
          </div>
        </div>

        <div className="health-metric-tile emerald">
          <div className="health-metric-icon">
            <CheckCircle2 size={18} />
          </div>
          <div className="health-metric-info">
            <span className="health-metric-lbl">Taken / Done</span>
            <span className="health-metric-val text-emerald">{completedCount}</span>
          </div>
        </div>

        <div className="health-metric-tile amber">
          <div className="health-metric-icon">
            <Clock size={18} />
          </div>
          <div className="health-metric-info">
            <span className="health-metric-lbl">Pending Today</span>
            <span className="health-metric-val text-amber">{pendingCount}</span>
          </div>
        </div>

        <div className="health-metric-tile purple">
          <div className="health-metric-icon">
            <Sparkles size={18} />
          </div>
          <div className="health-metric-info">
            <span className="health-metric-lbl">Daily Adherence</span>
            <span className="health-metric-val text-purple">{adherenceRate}%</span>
          </div>
        </div>
      </section>

      {/* Category Filter Pills & Actions */}
      <div className="health-filter-bar">
        <div className="health-category-pills">
          {categories.map((c) => {
            const count = c === 'All' ? reminders.length : reminders.filter((r) => r.category === c).length;
            return (
              <button
                key={c}
                type="button"
                className={`health-cat-pill ${selectedCategory === c ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c)}
              >
                <span className="pill-emoji">{c === 'All' ? '⚡' : getCategoryEmoji(c)}</span>
                <span className="pill-name">{c === 'All' ? 'All Habits' : c}</span>
                <span className="pill-count-bubble">{count}</span>
              </button>
            );
          })}
        </div>

        {onResetReminders && (
          <button
            type="button"
            className="btn-health-reset"
            onClick={() => {
              onResetReminders();
              if (onShowToast) onShowToast('Reset to default wellness reminders', 'info');
            }}
            title="Reset to sample reminders"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Habits</span>
          </button>
        )}
      </div>

      {/* Reminders Cards Grid */}
      <section className="health-reminders-grid" aria-label="Today's Reminders">
        {filteredReminders.length === 0 ? (
          <div className="health-empty-card">
            <HeartPulse size={36} className="text-teal opacity-50" />
            <h4 className="health-empty-title">No reminders in this category</h4>
            <p className="health-empty-desc">Create your first wellness reminder to stay on top of daily habits.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setReminderToEdit(null);
                setIsModalOpen(true);
              }}
              style={{ marginTop: '12px' }}
            >
              <Plus size={14} /> Add Reminder
            </button>
          </div>
        ) : (
          filteredReminders.map((r) => {
            const isDone = r.completed;
            const emoji = getCategoryEmoji(r.category);

            return (
              <div
                key={r.id}
                className={`health-reminder-card ${isDone ? 'is-completed' : ''}`}
              >
                {/* Top Category Badge & Actions */}
                <div className="health-card-top">
                  <span className="health-category-tag">
                    <span className="category-tag-emoji">{emoji}</span>
                    <span className="category-tag-label">{r.category}</span>
                  </span>

                  <span className={`health-status-badge ${isDone ? 'done' : 'upcoming'}`}>
                    {isDone ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} />
                        <span>Upcoming</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Reminder Main Info */}
                <div className="health-card-body">
                  <h4 className={`health-reminder-name ${isDone ? 'strikethrough text-muted' : ''}`}>
                    {r.name}
                  </h4>
                  {r.description && (
                    <p className="health-reminder-note">{r.description}</p>
                  )}

                  <div className="health-reminder-timing">
                    <span className="timing-pill">
                      <Clock size={12} />
                      <span>{r.time}</span>
                    </span>
                    <span className="timing-pill">
                      <Calendar size={12} />
                      <span>{r.frequency}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Solid Mark as Taken, Purple Edit, and Delete */}
                <div className="health-card-actions-row">
                  <button
                    type="button"
                    className={`btn-health-mark-taken ${isDone ? 'is-taken' : ''}`}
                    onClick={() => handleToggle(r)}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Taken ✓</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        <span>Mark as Taken</span>
                      </>
                    )}
                  </button>

                  <div className="health-card-secondary-btns">
                    <button
                      type="button"
                      className="btn-health-edit-purple"
                      onClick={() => {
                        setReminderToEdit(r);
                        setIsModalOpen(true);
                      }}
                      title="Edit Reminder"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-health-delete"
                      onClick={() => handleDelete(r)}
                      title="Delete Reminder"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Reminder Add / Edit Modal */}
      <HealthReminderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReminderToEdit(null);
        }}
        reminderToEdit={reminderToEdit}
        onSave={handleSave}
      />
    </div>
  );
}
