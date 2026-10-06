import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Tag,
  Flame,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatDateTime,
  isTaskOverdue,
  isTaskDueToday,
} from '../utils/taskUtils';

export default function TaskDetails({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const isDueToday = isTaskDueToday(task.dueDate, task.status);
  const isCompleted = task.status === 'Completed';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="details-header-tag">
            <span className="task-id-badge">ID: {task.id.slice(-6).toUpperCase()}</span>
            {isOverdue && (
              <span className="badge badge-overdue">
                <AlertCircle size={13} />
                <span>Overdue</span>
              </span>
            )}
            {isDueToday && (
              <span className="badge badge-due-today">
                <Clock size={13} />
                <span>Due Today</span>
              </span>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-body">
          {/* Title */}
          <h2 className={`details-title ${isCompleted ? 'task-title-completed' : ''}`}>
            {task.title}
          </h2>

          {/* Description */}
          <div className="details-section">
            <h4 className="details-section-heading">Description</h4>
            <div className="details-description">
              {task.description ? (
                <p className="details-desc-text">{task.description}</p>
              ) : (
                <p className="details-desc-placeholder">No description provided for this task.</p>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="details-meta-grid">
            {/* Status */}
            <div className="meta-item">
              <span className="meta-label">
                <Tag size={14} /> Status
              </span>
              <div className="meta-value">
                <span className={`badge badge-status badge-status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {task.status === 'Completed' && <CheckCircle2 size={13} />}
                  <span>{task.status}</span>
                </span>
                {/* Quick Status toggle */}
                <select
                  className="quick-status-select-sm"
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  aria-label="Change status"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="meta-item">
              <span className="meta-label">
                <Flame size={14} /> Priority
              </span>
              <div className="meta-value">
                <span className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}>
                  <span className="priority-indicator-dot" />
                  <span>{task.priority} Priority</span>
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="meta-item">
              <span className="meta-label">
                <Calendar size={14} /> Due Date
              </span>
              <div className="meta-value">
                <span className={`due-date-value ${isOverdue ? 'text-overdue' : ''}`}>
                  {formatDisplayDate(task.dueDate)}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="meta-item">
              <span className="meta-label">
                <Clock size={14} /> Created & Updated
              </span>
              <div className="meta-timestamps">
                <div className="timestamp-row">
                  <span className="timestamp-label">Created:</span>
                  <span className="timestamp-date">{formatDateTime(task.createdAt)}</span>
                </div>
                <div className="timestamp-row">
                  <span className="timestamp-label">Updated:</span>
                  <span className="timestamp-date">{formatDateTime(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer details-footer">
          <button
            type="button"
            className="btn btn-secondary-danger"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 size={16} />
            <span>Delete Task</span>
          </button>

          <div className="footer-right-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit2 size={16} />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
