import React from 'react';
import { SearchX, FilterX, ClipboardList, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({
  type = 'no-tasks', // 'no-tasks' | 'no-search' | 'no-filter'
  searchQuery = '',
  statusFilter = '',
  onCreateTask,
  onClearFilters,
  onResetTasks,
}) {
  if (type === 'no-search') {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap bg-blue-subtle">
          <SearchX size={36} className="text-blue" />
        </div>
        <h3 className="empty-title">No matching tasks found</h3>
        <p className="empty-desc">
          No tasks match your search query <span className="empty-query">"{searchQuery}"</span>. Try checking for typos or searching for a different keyword.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearFilters}
        >
          Clear Search Query
        </button>
      </div>
    );
  }

  if (type === 'no-filter') {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap bg-amber-subtle">
          <FilterX size={36} className="text-amber" />
        </div>
        <h3 className="empty-title">No tasks in this view</h3>
        <p className="empty-desc">
          There are currently no tasks matching the filter <span className="empty-query">"{statusFilter}"</span>.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearFilters}
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  // Default: completely empty task list
  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap bg-primary-subtle">
        <ClipboardList size={38} className="text-primary" />
      </div>
      <h3 className="empty-title">No tasks created yet</h3>
      <p className="empty-desc">
        Your task backlog is currently empty. Get started by creating your first task or restore realistic sample workplace tasks.
      </p>
      <div className="empty-actions">
        {onCreateTask && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onCreateTask}
          >
            <Plus size={16} />
            <span>Create First Task</span>
          </button>
        )}
        {onResetTasks && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetTasks}
          >
            <RotateCcw size={16} />
            <span>Load Sample Tasks</span>
          </button>
        )}
      </div>
    </div>
  );
}
