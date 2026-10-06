import React from 'react';
import {
  Layers,
  CircleDot,
  Clock,
  CheckCircle2,
  Flame,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import TaskList from '../components/TaskList';
import {
  getTodayFocusTasks,
  getUpcomingDeadlines,
  getOverdueTasks,
  getRecentlyCompletedTasks,
  formatDisplayDate,
} from '../utils/taskUtils';

export default function DashboardPage({
  tasks,
  stats,
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
  onNavigate,
}) {
  const todayFocus = getTodayFocusTasks(tasks);
  const upcomingDeadlines = getUpcomingDeadlines(tasks, 7);
  const overdueTasks = getOverdueTasks(tasks);
  const recentlyCompleted = getRecentlyCompletedTasks(tasks, 4);

  return (
    <div className="dashboard-page-container">
      {/* 1. Statistics Cards Row */}
      <section className="stats-cards-grid" aria-label="Task metrics">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={Layers}
          variant="default"
          subtext="Overall backlog"
          isActive={statusFilter === 'All' && priorityFilter === 'All'}
          onClick={() => {
            onStatusFilterChange('All');
            onPriorityFilterChange('All');
          }}
        />
        <StatCard
          label="Todo"
          value={stats.todo}
          icon={CircleDot}
          variant="todo"
          subtext="Pending start"
          isActive={statusFilter === 'Todo'}
          onClick={() => onStatusFilterChange(statusFilter === 'Todo' ? 'All' : 'Todo')}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={Clock}
          variant="progress"
          subtext="Actively worked on"
          isActive={statusFilter === 'In Progress'}
          onClick={() =>
            onStatusFilterChange(statusFilter === 'In Progress' ? 'All' : 'In Progress')
          }
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          variant="completed"
          subtext={`${stats.completionRate}% completion rate`}
          isActive={statusFilter === 'Completed'}
          onClick={() =>
            onStatusFilterChange(statusFilter === 'Completed' ? 'All' : 'Completed')
          }
        />
        <StatCard
          label="High Priority"
          value={stats.highPriority}
          icon={Flame}
          variant="high"
          subtext="Urgent focus items"
          isActive={priorityFilter === 'High'}
          onClick={() =>
            onPriorityFilterChange(priorityFilter === 'High' ? 'All' : 'High')
          }
        />
      </section>

      {/* 2. Smart Productivity Brief (Today's Focus, Deadlines, Velocity) */}
      <section className="smart-dashboard-grid" aria-label="Smart workflow insights">
        {/* Today's Focus Card */}
        <div className="smart-widget-card">
          <div className="widget-header">
            <div className="widget-title-group">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="widget-title">Today's Focus</h3>
              <span className="widget-badge">{todayFocus.length}</span>
            </div>
            <button
              type="button"
              className="widget-action-link"
              onClick={() => onStatusFilterChange('Due Today')}
            >
              Filter Due Today
            </button>
          </div>

          <div className="widget-body">
            {todayFocus.length === 0 ? (
              <p className="widget-empty-msg">No urgent tasks due today! Keep momentum going.</p>
            ) : (
              <div className="widget-task-mini-list">
                {todayFocus.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="widget-task-mini-item"
                    onClick={() => onViewTask(t)}
                  >
                    <span className={`priority-indicator-dot dot-${t.priority.toLowerCase()}`} />
                    <span className="mini-task-title">{t.title}</span>
                    <span className="mini-task-date">{formatDisplayDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines (Next 7 Days) */}
        <div className="smart-widget-card">
          <div className="widget-header">
            <div className="widget-title-group">
              <Calendar size={16} className="text-blue-500" />
              <h3 className="widget-title">Upcoming Deadlines</h3>
              <span className="widget-badge">{upcomingDeadlines.length}</span>
            </div>
            <button
              type="button"
              className="widget-action-link"
              onClick={() => onNavigate('/calendar')}
            >
              View Calendar <ArrowRight size={12} />
            </button>
          </div>

          <div className="widget-body">
            {upcomingDeadlines.length === 0 ? (
              <p className="widget-empty-msg">No deadlines scheduled in the next 7 days.</p>
            ) : (
              <div className="widget-task-mini-list">
                {upcomingDeadlines.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="widget-task-mini-item"
                    onClick={() => onViewTask(t)}
                  >
                    <span className="mini-task-title">{t.title}</span>
                    <span className="mini-due-pill">{formatDisplayDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overdue Action Center */}
        {overdueTasks.length > 0 && (
          <div className="smart-widget-card border-danger-subtle">
            <div className="widget-header">
              <div className="widget-title-group">
                <AlertCircle size={16} className="text-rose-500" />
                <h3 className="widget-title text-danger">Overdue Attention</h3>
                <span className="widget-badge bg-rose-pill">{overdueTasks.length}</span>
              </div>
              <button
                type="button"
                className="widget-action-link text-danger"
                onClick={() => onStatusFilterChange('Overdue')}
              >
                Filter Overdue
              </button>
            </div>

            <div className="widget-body">
              <div className="widget-task-mini-list">
                {overdueTasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="widget-task-mini-item text-danger"
                    onClick={() => onViewTask(t)}
                  >
                    <span className="mini-task-title">{t.title}</span>
                    <span className="text-rose-500 font-semibold">{formatDisplayDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recently Completed */}
        <div className="smart-widget-card">
          <div className="widget-header">
            <div className="widget-title-group">
              <CheckCircle2 size={16} className="text-emerald" />
              <h3 className="widget-title">Recently Completed</h3>
              <span className="widget-badge">{recentlyCompleted.length}</span>
            </div>
            <button
              type="button"
              className="widget-action-link"
              onClick={() => onStatusFilterChange('Completed')}
            >
              All Completed
            </button>
          </div>

          <div className="widget-body">
            {recentlyCompleted.length === 0 ? (
              <p className="widget-empty-msg">No tasks completed yet. Complete your first task!</p>
            ) : (
              <div className="widget-task-mini-list">
                {recentlyCompleted.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="widget-task-mini-item completed-item"
                    onClick={() => onViewTask(t)}
                  >
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span className="mini-task-title strikethrough">{t.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Search, Filter, Sort & View Bar */}
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

      {/* 4. Task Grid / Table / Empty States */}
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
