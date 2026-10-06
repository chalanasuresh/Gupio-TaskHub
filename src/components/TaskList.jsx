import React from 'react';
import TaskCard from './TaskCard';
import TaskTableView from './TaskTableView';
import EmptyState from './EmptyState';

export default function TaskList({
  tasks,
  totalOriginalTasks,
  searchQuery,
  statusFilter,
  priorityFilter,
  viewMode = 'grid',
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateTask,
  onClearFilters,
  onResetTasks,
}) {
  // 1. Check if workspace has absolutely zero tasks
  if (totalOriginalTasks === 0) {
    return (
      <EmptyState
        type="no-tasks"
        onCreateTask={onCreateTask}
        onResetTasks={onResetTasks}
      />
    );
  }

  // 2. Check if search or filters returned zero results
  if (tasks.length === 0) {
    if (searchQuery.trim().length > 0) {
      return (
        <EmptyState
          type="no-search"
          searchQuery={searchQuery}
          onClearFilters={onClearFilters}
        />
      );
    }
    return (
      <EmptyState
        type="no-filter"
        statusFilter={statusFilter !== 'All' ? statusFilter : priorityFilter}
        onClearFilters={onClearFilters}
      />
    );
  }

  // 3. Render table view or grid view
  if (viewMode === 'table') {
    return (
      <TaskTableView
        tasks={tasks}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
