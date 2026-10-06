import React, { useMemo } from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
  Circle,
  Check,
  Flame,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  getTodayFocusTasks,
  getUpcomingDeadlines,
  getRecentlyCompletedTasks,
  formatDisplayDate,
  isTaskOverdue,
  isTaskDueToday,
} from '../utils/taskUtils';

export default function DashboardPage({
  tasks = [],
  stats,
  onViewTask,
  onStatusChange,
  onCreateTask,
  onNavigate,
  nextHealthReminder,
  onToggleHealthReminder,
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

  const todayDueCount = useMemo(() => {
    return tasks.filter((t) => isTaskDueToday(t.dueDate, t.status)).length;
  }, [tasks]);

  const todayFocus = useMemo(() => {
    return getTodayFocusTasks(tasks).slice(0, 5);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return getUpcomingDeadlines(tasks, 7).slice(0, 4);
  }, [tasks]);

  const recentlyCompleted = useMemo(() => {
    return getRecentlyCompletedTasks(tasks, 4);
  }, [tasks]);

  return (
    <div className="dashboard-page-container">
      {/* 1. Header Hero Welcome */}
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
            Here's your productivity overview for today.
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

      {/* 2. Compact Statistics (4 Cards) */}
      <section className="dashboard-stats-row" aria-label="Task metrics">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={Layers}
          variant="default"
          subtext="Overall backlog"
          onClick={() => onNavigate('/tasks')}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          variant="completed"
          subtext={`${stats.completionRate}% completion rate`}
          onClick={() => onNavigate('/tasks')}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={Clock}
          variant="progress"
          subtext="Active deliverables"
          onClick={() => onNavigate('/tasks')}
        />
        <StatCard
          label="Due Today"
          value={todayDueCount}
          icon={Flame}
          variant="high"
          subtext="Requires daily focus"
          onClick={() => onNavigate('/tasks')}
        />
      </section>

      {/* 3. Today's Focus (Top 3-5 Priority Tasks) */}
      <section className="dashboard-card today-focus-section">
        <div className="dashboard-section-header">
          <div className="section-title-group">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="dashboard-section-heading">Today's Focus</h3>
            <span className="section-count-badge">{todayFocus.length}</span>
          </div>
          <button
            type="button"
            className="section-link-btn"
            onClick={() => onNavigate('/tasks')}
          >
            View in Tasks <ArrowRight size={13} />
          </button>
        </div>

        <div className="today-focus-content">
          {todayFocus.length === 0 ? (
            <div className="today-focus-empty">
              <p>🎉 All priority tasks for today are clear! Check upcoming deadlines below.</p>
            </div>
          ) : (
            <div className="today-tasks-list">
              {todayFocus.map((task) => {
                const isDone = task.status === 'Completed';
                const isOverdue = isTaskOverdue(task.dueDate, task.status);

                return (
                  <div
                    key={task.id}
                    className={`today-task-row ${isDone ? 'is-completed' : ''}`}
                    onClick={() => onViewTask(task)}
                  >
                    <button
                      type="button"
                      className="task-row-check-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, isDone ? 'Todo' : 'Completed');
                      }}
                      title={isDone ? 'Mark as Todo' : 'Mark Complete'}
                      aria-label="Toggle complete"
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>

                    <div className="today-task-info">
                      <div className="today-task-title-wrap">
                        <span className={`priority-indicator-dot dot-${task.priority.toLowerCase()}`} />
                        <span className={`today-task-title ${isDone ? 'strikethrough' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      {task.description && (
                        <p className="today-task-desc-snippet">{task.description}</p>
                      )}
                    </div>

                    <div className="today-task-meta">
                      <span className={`today-due-badge ${isOverdue ? 'overdue' : ''}`}>
                        {formatDisplayDate(task.dueDate)}
                      </span>
                      <span className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Upcoming Deadlines & Productivity Overview (2-Column Grid) */}
      <div className="dashboard-two-col-grid">
        {/* Left: Upcoming Deadlines */}
        <div className="dashboard-card upcoming-card">
          <div className="dashboard-section-header">
            <div className="section-title-group">
              <Calendar size={16} className="text-primary" />
              <h3 className="dashboard-section-heading">Upcoming Deadlines</h3>
              <span className="section-count-badge">{upcomingTasks.length}</span>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => onNavigate('/calendar')}
            >
              Calendar <ArrowRight size={13} />
            </button>
          </div>

          <div className="upcoming-content">
            {upcomingTasks.length === 0 ? (
              <p className="dashboard-empty-text">No upcoming deadlines in the next 7 days.</p>
            ) : (
              <div className="upcoming-tasks-mini-list">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="upcoming-mini-item"
                    onClick={() => onViewTask(t)}
                  >
                    <span className={`priority-indicator-dot dot-${t.priority.toLowerCase()}`} />
                    <span className="upcoming-mini-title">{t.title}</span>
                    <span className="upcoming-date-pill">{formatDisplayDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Productivity Overview */}
        <div className="dashboard-card productivity-card">
          <div className="dashboard-section-header">
            <div className="section-title-group">
              <TrendingUp size={16} className="text-emerald" />
              <h3 className="dashboard-section-heading">Productivity Overview</h3>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => onNavigate('/analytics')}
            >
              Full Analytics <ArrowRight size={13} />
            </button>
          </div>

          <div className="productivity-content">
            <div className="prod-progress-block">
              <div className="prod-progress-labels">
                <span className="prod-progress-sub">Backlog Completion Ratio</span>
                <span className="prod-progress-pct text-emerald">{stats.completionRate}%</span>
              </div>
              <div className="mini-progress-bar-wrap">
                <div
                  className="mini-progress-bar-fill"
                  style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="prod-stats-mini-row">
              <div className="prod-mini-stat">
                <span className="prod-mini-val text-emerald">{stats.completed}</span>
                <span className="prod-mini-lbl">Completed</span>
              </div>
              <div className="prod-mini-stat">
                <span className="prod-mini-val text-primary">{stats.inProgress}</span>
                <span className="prod-mini-lbl">In Progress</span>
              </div>
              <div className="prod-mini-stat">
                <span className="prod-mini-val text-amber">{stats.todo}</span>
                <span className="prod-mini-lbl">To Do</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Small Health Reminder & Recent Activity (2-Column Grid) */}
      <div className="dashboard-two-col-grid">
        {/* Left: Small Health Reminder Widget */}
        <div className="dashboard-card health-widget-card">
          <div className="dashboard-section-header">
            <div className="section-title-group">
              <span style={{ fontSize: '16px' }}>💊</span>
              <h3 className="dashboard-section-heading">Health Reminder</h3>
            </div>
            <button
              type="button"
              className="section-link-btn text-teal"
              onClick={() => onNavigate('/health')}
            >
              View Health <ArrowRight size={13} />
            </button>
          </div>

          <div className="health-widget-body">
            {nextHealthReminder ? (
              <div className="health-widget-item">
                <div className="health-widget-text">
                  <span className="health-widget-sublabel">Next reminder</span>
                  <strong className="health-widget-name">{nextHealthReminder.name}</strong>
                  <span className="health-widget-timing">
                    Today · {nextHealthReminder.time}
                  </span>
                </div>

                <div className="health-widget-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      nextHealthReminder.completed ? 'btn-secondary text-emerald' : 'btn-teal-soft'
                    }`}
                    onClick={() => onToggleHealthReminder && onToggleHealthReminder(nextHealthReminder.id)}
                  >
                    <Check size={13} />
                    <span>{nextHealthReminder.completed ? 'Taken ✓' : 'Mark as Taken'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="health-widget-empty">
                <p>All daily health reminders checked off for today!</p>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate('/health')}
                  style={{ marginTop: '6px' }}
                >
                  Manage Reminders
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Activity / Recently Completed */}
        <div className="dashboard-card recent-activity-card">
          <div className="dashboard-section-header">
            <div className="section-title-group">
              <CheckCircle2 size={16} className="text-emerald" />
              <h3 className="dashboard-section-heading">Recent Milestones</h3>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => onNavigate('/tasks')}
            >
              All Tasks <ArrowRight size={13} />
            </button>
          </div>

          <div className="recent-activity-body">
            {recentlyCompleted.length === 0 ? (
              <p className="dashboard-empty-text">No completed milestones yet. Complete a task to track velocity!</p>
            ) : (
              <div className="recent-milestones-list">
                {recentlyCompleted.map((t) => (
                  <div
                    key={t.id}
                    className="milestone-item"
                    onClick={() => onViewTask(t)}
                  >
                    <CheckCircle2 size={14} className="text-emerald flex-shrink-0" />
                    <span className="milestone-title strikethrough">{t.title}</span>
                    <span className="milestone-badge">Done</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
