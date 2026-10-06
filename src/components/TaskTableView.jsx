import React from 'react';
import {
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

export default function TaskTableView({
  tasks,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="table-responsive-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th className="th-status" style={{ width: '40px' }}>Done</th>
            <th className="th-title">Task Title & Details</th>
            <th className="th-status-badge">Status</th>
            <th className="th-priority">Priority</th>
            <th className="th-due">Due Date</th>
            <th className="th-actions" style={{ width: '130px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isOverdue = isTaskOverdue(task.dueDate, task.status);
            const isDueToday = isTaskDueToday(task.dueDate, task.status);
            const isCompleted = task.status === 'Completed';

            return (
              <tr
                key={task.id}
                className={`table-row ${isCompleted ? 'row-completed' : ''}`}
                onClick={() => onView(task)}
              >
                {/* Complete checkbox */}
                <td
                  className="td-checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, isCompleted ? 'Todo' : 'Completed');
                  }}
                >
                  <button
                    type="button"
                    className={`quick-complete-btn-sm ${isCompleted ? 'checked' : ''}`}
                    title={isCompleted ? 'Mark Todo' : 'Mark Completed'}
                    aria-label={isCompleted ? 'Mark Todo' : 'Mark Completed'}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                </td>

                {/* Title & snippet */}
                <td className="td-title">
                  <div className="table-title-cell">
                    <span className={`table-task-name ${isCompleted ? 'completed-text' : ''}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="table-task-desc">{task.description}</span>
                    )}
                  </div>
                </td>

                {/* Status Badge & quick changer */}
                <td className="td-status" onClick={(e) => e.stopPropagation()}>
                  <select
                    className={`table-status-select badge-status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    aria-label="Change status"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Priority */}
                <td className="td-priority">
                  <span
                    className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}
                  >
                    <span className="priority-indicator-dot" />
                    <span>{task.priority}</span>
                  </span>
                </td>

                {/* Due Date */}
                <td className="td-due">
                  <div className="table-due-cell">
                    <span className={`table-due-date ${isOverdue ? 'text-overdue font-semibold' : ''}`}>
                      {formatDisplayDate(task.dueDate)}
                    </span>
                    {isOverdue && (
                      <span className="badge-pill badge-overdue-pill" title="Overdue">
                        Overdue
                      </span>
                    )}
                    {isDueToday && (
                      <span className="badge-pill badge-today-pill" title="Due Today">
                        Today
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                  <div className="table-actions-group">
                    <button
                      type="button"
                      className="action-btn action-view"
                      onClick={() => onView(task)}
                      title="View Details"
                      aria-label="View details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="action-btn action-edit"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                      aria-label="Edit task"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="action-btn action-delete"
                      onClick={() => onDelete(task)}
                      title="Delete Task"
                      aria-label="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
