import React, { useMemo } from 'react';
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
  Plus,
  TrendingUp,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
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
  const { currentUser } = useAuth();
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';

  const { greeting, todayFormatted } = useMemo(() => {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    return { greeting: greet, todayFormatted: dateStr };
  }, []);

  const todayFocus = getTodayFocusTasks(tasks);
  const upcomingDeadlines = getUpcomingDeadlines(tasks, 7);
  const overdueTasks = getOverdueTasks(tasks);
  const recentlyCompleted = getRecentlyCompletedTasks(tasks, 3);

  return (
    <div className="dashboard-page-container">
      {/* 1. Compact Dashboard Hero Section */}
      <section className="dashboard-hero-section" aria-label="Welcome banner">
        <div className="hero-welcome-left">
          <div className="hero-title-row">
            <h2 className="hero-greeting-title">
              {greeting}, {userName} <span className="hero-wave">👋</span>
            </h2>
            <div className="hero-date-badge">
              <Calendar size={13} className="text-primary" />
              <span>{todayFormatted}</span>
            </div>
          </div>
          <p className="hero-greeting-subtitle">
            Here's what's happening with your tasks today.
          </p>
        </div>

        <div className="hero-welcome-right">
          <button
            type="button"
            className="btn btn-primary btn-hero-add"
            onClick={onCreateTask}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </section>

      {/* 2. 5-Column Statistics Cards Row */}
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
          subtext="Active sprints"
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
          subtext="Urgent action items"
          isActive={priorityFilter === 'High'}
          onClick={() =>
            onPriorityFilterChange(priorityFilter === 'High' ? 'All' : 'High')
          }
        />
      </section>

      {/* 3. Main Dashboard Insights Grid */}
      <div className="dashboard-insights-grid" aria-label="Smart workflow insights">
        {/* Left Column: Upcoming Deadlines & Overdue */}
        <div className="insights-col-left">
          {/* Upcoming Deadlines Widget */}
          <div className="smart-widget-card">
            <div className="widget-header">
              <div className="widget-title-group">
                <Calendar size={15} className="text-primary" />
                <h3 className="widget-title">Upcoming Deadlines</h3>
                <span className="widget-badge">{upcomingDeadlines.length}</span>
              </div>
              <button
                type="button"
                className="widget-action-link"
                onClick={() => onNavigate('/calendar')}
              >
                Calendar <ArrowRight size={12} />
              </button>
            </div>

            <div className="widget-body">
              {upcomingDeadlines.length === 0 ? (
                <p className="widget-empty-msg">No deadlines scheduled in next 7 days.</p>
              ) : (
                <div className="widget-task-mini-list">
                  {upcomingDeadlines.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="widget-task-mini-item"
                      onClick={() => onViewTask(t)}
                    >
                      <span className={`priority-indicator-dot dot-${t.priority.toLowerCase()}`} />
                      <span className="mini-task-title">{t.title}</span>
                      <span className="mini-due-pill">{formatDisplayDate(t.dueDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overdue Attention (shown if any) */}
          {overdueTasks.length > 0 && (
            <div className="smart-widget-card border-danger-subtle">
              <div className="widget-header">
                <div className="widget-title-group">
                  <AlertCircle size={15} className="text-danger" />
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
                  {overdueTasks.slice(0, 2).map((t) => (
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
        </div>

        {/* Right Column: Today's Focus & Productivity Summary */}
        <div className="insights-col-right">
          {/* Today's Focus Card */}
          <div className="smart-widget-card">
            <div className="widget-header">
              <div className="widget-title-group">
                <Sparkles size={15} className="text-amber-500" />
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

          {/* Productivity Velocity Mini Card */}
          <div className="smart-widget-card">
            <div className="widget-header">
              <div className="widget-title-group">
                <TrendingUp size={15} className="text-emerald" />
                <h3 className="widget-title">Productivity Velocity</h3>
              </div>
              <button
                type="button"
                className="widget-action-link"
                onClick={() => onNavigate('/analytics')}
              >
                Analytics <ArrowRight size={12} />
              </button>
            </div>

            <div className="widget-body">
              <div className="mini-progress-summary">
                <div className="mini-progress-bar-wrap">
                  <div
                    className="mini-progress-bar-fill"
                    style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                  />
                </div>
                <div className="mini-progress-labels">
                  <span className="text-secondary">{stats.completed} of {stats.total} tasks completed</span>
                  <span className="font-semibold text-emerald">{stats.completionRate}%</span>
                </div>
              </div>

              {recentlyCompleted.length > 0 && (
                <div className="recently-completed-snippet">
                  <span className="snippet-label">Latest done:</span>
                  <span className="snippet-title strikethrough">
                    {recentlyCompleted[0].title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Tasks Backlog Section */}
      <section className="dashboard-tasks-section" aria-label="Task backlog and listing">
        <div className="tasks-section-header">
          <div>
            <h3 className="tasks-section-title">Task Workspace</h3>
            <p className="tasks-section-subtitle">
              Filter, search, and manage your team priorities
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('/tasks')}
          >
            Full Task View <ArrowRight size={13} />
          </button>
        </div>

        {/* Controls Section */}
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

        {/* Task Grid / Table Listing */}
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
      </section>
    </div>
  );
}
