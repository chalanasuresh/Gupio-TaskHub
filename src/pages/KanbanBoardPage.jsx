import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Clock3,
} from 'lucide-react';
import { formatDisplayDate, isTaskOverdue, isTaskDueToday } from '../utils/taskUtils';

export default function KanbanBoardPage({
  tasks = [],
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  onCreateTask,
}) {
  const [dragOverCol, setDragOverCol] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const columns = [
    {
      id: 'Todo',
      title: 'TODO',
      color: 'slate',
      icon: Circle,
      tasks: tasks.filter((t) => t.status === 'Todo'),
    },
    {
      id: 'In Progress',
      title: 'IN PROGRESS',
      color: 'blue',
      icon: Clock3,
      tasks: tasks.filter((t) => t.status === 'In Progress'),
    },
    {
      id: 'Completed',
      title: 'COMPLETED',
      color: 'emerald',
      icon: CheckCircle2,
      tasks: tasks.filter((t) => t.status === 'Completed'),
    },
  ];

  function handleDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(taskId);
  }

  function handleDragOver(e, columnId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== columnId) {
      setDragOverCol(columnId);
    }
  }

  function handleDragLeave(e, columnId) {
    // Only reset if leaving column container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverCol === columnId) {
      setDragOverCol(null);
    }
  }

  function handleDrop(e, columnId) {
    e.preventDefault();
    setDragOverCol(null);
    setDraggingTaskId(null);

    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, columnId);
    }
  }

  function handleDragEnd() {
    setDragOverCol(null);
    setDraggingTaskId(null);
  }

  return (
    <div className="kanban-board-wrapper">
      <div className="kanban-columns-container">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              className={`kanban-column kanban-col-${col.color} ${isOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="kanban-col-header">
                <div className="kanban-col-title-group">
                  <ColIcon size={16} className={`kanban-col-icon text-${col.color}`} />
                  <h3 className="kanban-col-title">{col.title}</h3>
                  <span className="kanban-count-pill">{col.tasks.length}</span>
                </div>
                <button
                  type="button"
                  className="kanban-add-card-btn"
                  onClick={() => onCreateTask(col.id)}
                  title={`Add task to ${col.title}`}
                  aria-label={`Add task to ${col.title}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Column Cards Drop Area */}
              <div className="kanban-cards-area">
                {col.tasks.length === 0 ? (
                  <div className="kanban-empty-column">
                    <p>No tasks in {col.title.toLowerCase()}</p>
                    <span className="kanban-drop-hint">Drop tasks here or click +</span>
                  </div>
                ) : (
                  col.tasks.map((task) => {
                    const isOverdue = isTaskOverdue(task.dueDate, task.status);
                    const isDueToday = isTaskDueToday(task.dueDate, task.status);
                    const isDragging = draggingTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`kanban-card ${isDragging ? 'is-dragging' : ''} ${
                          task.priority === 'High' ? 'card-high-priority' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onView(task)}
                      >
                        {/* Top Meta Badges */}
                        <div className="kanban-card-top">
                          <span
                            className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}
                          >
                            <span className="priority-indicator-dot" />
                            <span>{task.priority}</span>
                          </span>

                          <div className="kanban-card-date-tags">
                            {isOverdue && (
                              <span className="badge badge-overdue" title="Overdue">
                                <AlertCircle size={11} />
                                <span>Overdue</span>
                              </span>
                            )}
                            {isDueToday && (
                              <span className="badge badge-due-today" title="Due Today">
                                <Clock size={11} />
                                <span>Today</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Title & Snippet */}
                        <h4 className="kanban-card-title">{task.title}</h4>
                        {task.description && (
                          <p className="kanban-card-desc">{task.description}</p>
                        )}

                        {/* Card Footer */}
                        <div className="kanban-card-footer">
                          <div className="kanban-card-due">
                            <Calendar size={13} className="text-muted" />
                            <span className={`kanban-due-date ${isOverdue ? 'text-overdue' : ''}`}>
                              {formatDisplayDate(task.dueDate)}
                            </span>
                          </div>

                          <div
                            className="kanban-card-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="action-btn-xs"
                              onClick={() => onView(task)}
                              title="View"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              type="button"
                              className="action-btn-xs"
                              onClick={() => onEdit(task)}
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              className="action-btn-xs text-danger"
                              onClick={() => onDelete(task)}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
