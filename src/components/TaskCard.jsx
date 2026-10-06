import React from 'react';
import {
  Calendar,
  AlertCircle,
  Clock,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  formatDisplayDate,
  isTaskOverdue,
  isTaskDueToday,
} from '../utils/taskUtils';

export default function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const isDueToday = isTaskDueToday(task.dueDate, task.status);
  const isCompleted = task.status === 'Completed';
  const isHighPriority = task.priority === 'High';

  function handleQuickToggleStatus(e) {
    e.stopPropagation();
    if (isCompleted) {
      onStatusChange(task.id, 'Todo');
    } else {
      onStatusChange(task.id, 'Completed');
    }
  }

  return (
    <div
      className={`task-card ${isCompleted ? 'task-card-completed' : ''} ${
        isHighPriority ? 'task-card-high-priority' : ''
      }`}
      onClick={() => onView(task)}
    >
      {/* Top Header: Status & Priority Badges */}
      <div className="task-card-header">
        <div className="task-card-badges">
          {/* Status Badge */}
          <span
            className={`badge badge-status badge-status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {isCompleted && <CheckCircle2 size={12} />}
            <span>{task.status}</span>
          </span>

          {/* Priority Badge */}
          <span
            className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}
          >
            <span className="priority-indicator-dot" />
            <span>{task.priority}</span>
          </span>
        </div>

        {/* Due Date Alert Badges */}
        <div className="task-date-badges">
          {isOverdue && (
            <span className="badge badge-overdue" title="Due date has passed">
              <AlertCircle size={12} />
              <span>Overdue</span>
            </span>
          )}
          {isDueToday && (
            <span className="badge badge-due-today" title="Due before end of day">
              <Clock size={12} />
              <span>Due Today</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="task-card-body">
        <div className="task-title-row">
          <button
            type="button"
            className={`quick-complete-btn ${isCompleted ? 'checked' : ''}`}
            onClick={handleQuickToggleStatus}
            title={isCompleted ? 'Mark as Todo' : 'Mark as Completed'}
            aria-label={isCompleted ? 'Mark as Todo' : 'Mark as Completed'}
          >
            {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          </button>
          <h3 className={`task-card-title ${isCompleted ? 'completed-text' : ''}`}>
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="task-card-desc">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="task-card-footer">
        <div className="task-due-info">
          <Calendar size={14} className="task-due-icon" />
          <span className={`task-due-text ${isOverdue ? 'text-overdue font-semibold' : ''}`}>
            {formatDisplayDate(task.dueDate)}
          </span>
        </div>

        <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="action-btn action-view"
            onClick={() => onView(task)}
            title="View Details"
            aria-label="View task details"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className="action-btn action-edit"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit task"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            className="action-btn action-delete"
            onClick={() => onDelete(task)}
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
