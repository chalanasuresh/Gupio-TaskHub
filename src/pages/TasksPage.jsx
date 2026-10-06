import React from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import TaskList from '../components/TaskList';

export default function TasksPage({
  tasks,
  filteredTasks,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isFiltered,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onCreateTask,
  onResetTasks,
}) {
  return (
    <div className="tasks-page-container">
      {/* Top Controls Bar */}
      <section className="controls-section" aria-label="Task controls">
        <SearchFilterBar
          search={searchQuery}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={onPriorityFilterChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          totalResults={filteredTasks.length}
          onResetFilters={onResetFilters}
          isFiltered={isFiltered}
        />
      </section>

      {/* Task Listing View */}
      <section className="task-content-section" aria-label="Task listing">
        <TaskList
          tasks={filteredTasks}
          totalOriginalTasks={tasks.length}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          viewMode={viewMode}
          onView={onViewTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStatusChange={onStatusChange}
          onCreateTask={onCreateTask}
          onClearFilters={onResetFilters}
          onResetTasks={onResetTasks}
        />
      </section>
    </div>
  );
}
