import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { validateTask, getTodayDateString } from '../utils/taskUtils';

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: getTodayDateString(),
};

export default function TaskForm({
  isOpen,
  taskToEdit = null, // null for create, object for edit
  onSubmit,
  onClose,
}) {
  const isEditing = Boolean(taskToEdit);

  const [formData, setFormData] = useState(() => {
    if (taskToEdit) {
      return {
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        status: taskToEdit.status || 'Todo',
        priority: taskToEdit.priority || 'Medium',
        dueDate: taskToEdit.dueDate || getTodayDateString(),
      };
    }
    return DEFAULT_FORM;
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle escape key
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

  if (!isOpen) return null;

  function handleChange(field, value) {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live validation if the field was already touched
    if (touched[field]) {
      const validation = validateTask(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: validation.errors[field] || '',
      }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateTask(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field] || '',
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
    });

    const validation = validateTask(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  }

  // Quick date shortcuts
  function setQuickDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    handleChange('dueDate', dateStr);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update task details, change status, or reschedule due date.'
                : 'Fill in the information below to add a new task to your workspace.'}
            </p>
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

        <form onSubmit={handleSubmit} className="task-form" noValidate>
          {/* Title Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-title" className="form-label">
                Task Title <span className="text-required">*</span>
              </label>
              <span className="char-counter">
                {formData.title.length}/100
              </span>
            </div>
            <input
              id="task-title"
              type="text"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g., Prepare weekly project report"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              maxLength={100}
              autoFocus
            />
            {errors.title && (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-description" className="form-label">
                Description <span className="text-optional">(Optional)</span>
              </label>
              <span className="char-counter">
                {formData.description.length}/500
              </span>
            </div>
            <textarea
              id="task-description"
              rows={3}
              className={`form-textarea ${errors.description ? 'is-invalid' : ''}`}
              placeholder="Add relevant context, steps, or acceptance criteria..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              maxLength={500}
            />
            {errors.description && (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Status and Priority Row */}
          <div className="form-grid-2">
            {/* Status */}
            <div className="form-group">
              <label htmlFor="task-status" className="form-label">
                Status <span className="text-required">*</span>
              </label>
              <select
                id="task-status"
                className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                onBlur={() => handleBlur('status')}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.status}</span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                Priority <span className="text-required">*</span>
              </label>
              <select
                id="task-priority"
                className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                onBlur={() => handleBlur('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.priority}</span>
                </div>
              )}
            </div>
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-dueDate" className="form-label">
                Due Date <span className="text-required">*</span>
              </label>
              <div className="date-quick-buttons">
                <button
                  type="button"
                  className="btn-pill-xs"
                  onClick={() => setQuickDate(0)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="btn-pill-xs"
                  onClick={() => setQuickDate(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="btn-pill-xs"
                  onClick={() => setQuickDate(7)}
                >
                  +1 Week
                </button>
              </div>
            </div>
            <div className="date-input-wrap">
              <input
                id="task-dueDate"
                type="date"
                className={`form-input ${errors.dueDate ? 'is-invalid' : ''}`}
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                onBlur={() => handleBlur('dueDate')}
              />
              <Calendar size={18} className="date-input-icon" />
            </div>
            {errors.dueDate && (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.dueDate}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
