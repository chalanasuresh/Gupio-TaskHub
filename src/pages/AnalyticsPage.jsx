import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  CircleDot,
  AlertTriangle,
  Flame,
  Layers,
} from 'lucide-react';
import {
  getWeeklyProductivity,
  getNext7DaysDistribution,
} from '../utils/taskUtils';

export default function AnalyticsPage({ tasks = [], stats }) {
  const weekly = getWeeklyProductivity(tasks);
  const next7Days = getNext7DaysDistribution(tasks);

  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const inProgress = stats.inProgress || 0;
  const todo = stats.todo || 0;

  // Status breakdown percentages for Donut chart
  const pCompleted = total > 0 ? (completed / total) * 100 : 0;
  const pInProgress = total > 0 ? (inProgress / total) * 100 : 0;
  const pTodo = total > 0 ? (todo / total) * 100 : 0;

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const strokeCompleted = (pCompleted / 100) * circumference;
  const strokeProgress = (pInProgress / 100) * circumference;
  const strokeTodo = (pTodo / 100) * circumference;

  const offsetCompleted = 0;
  const offsetProgress = -strokeCompleted;
  const offsetTodo = -(strokeCompleted + strokeProgress);

  // Priority counts
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const medCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;
  const maxPriority = Math.max(highCount, medCount, lowCount, 1);

  // Weekly max for bar chart scaling
  const maxWeekly = Math.max(...weekly.days.map((d) => d.completed), 1);

  // Next 7 days max for deadlines chart
  const maxDeadlines = Math.max(...next7Days.map((d) => d.count), 1);

  return (
    <div className="analytics-page-wrapper">
      {/* Top Summary Banner */}
      <div className="analytics-summary-banner">
        <div className="summary-banner-left">
          <div className="summary-banner-icon">
            <TrendingUp size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="summary-banner-title">Team Productivity Intelligence</h2>
            <p className="summary-banner-desc">
              You're <span className="highlight-metric">{stats.completionRate}%</span> through your total task backlog. {weekly.totalThisWeek} {weekly.totalThisWeek === 1 ? 'task was' : 'tasks were'} completed in the last 7 days.
            </p>
          </div>
        </div>
        <div className="summary-banner-stats">
          <div className="banner-stat-box">
            <span className="banner-stat-label">Completion Rate</span>
            <span className="banner-stat-val text-emerald">{stats.completionRate}%</span>
          </div>
          <div className="banner-stat-box">
            <span className="banner-stat-label">Active Backlog</span>
            <span className="banner-stat-val">{stats.todo + stats.inProgress}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="analytics-overview-grid">
        <div className="analytics-stat-card">
          <div className="stat-card-label-row">
            <span>Total Backlog</span>
            <Layers size={17} className="text-secondary" />
          </div>
          <div className="stat-card-metric">{stats.total}</div>
          <span className="stat-card-trend">All created tasks</span>
        </div>

        <div className="analytics-stat-card stat-card-completed">
          <div className="stat-card-label-row">
            <span>Completed</span>
            <CheckCircle2 size={17} className="text-emerald" />
          </div>
          <div className="stat-card-metric text-emerald">{stats.completed}</div>
          <span className="stat-card-trend">{pCompleted.toFixed(0)}% of total</span>
        </div>

        <div className="analytics-stat-card stat-card-progress">
          <div className="stat-card-label-row">
            <span>In Progress</span>
            <Clock size={17} className="text-blue" />
          </div>
          <div className="stat-card-metric text-blue">{stats.inProgress}</div>
          <span className="stat-card-trend">{pInProgress.toFixed(0)}% of total</span>
        </div>

        <div className="analytics-stat-card stat-card-todo">
          <div className="stat-card-label-row">
            <span>To Do</span>
            <CircleDot size={17} className="text-muted" />
          </div>
          <div className="stat-card-metric">{stats.todo}</div>
          <span className="stat-card-trend">{pTodo.toFixed(0)}% of total</span>
        </div>

        <div className="analytics-stat-card stat-card-overdue">
          <div className="stat-card-label-row">
            <span>Overdue</span>
            <AlertTriangle size={17} className="text-rose-500" />
          </div>
          <div className="stat-card-metric text-danger">{stats.overdue}</div>
          <span className="stat-card-trend">Require immediate resolution</span>
        </div>

        <div className="analytics-stat-card stat-card-high">
          <div className="stat-card-label-row">
            <span>High Priority</span>
            <Flame size={17} className="text-amber-500" />
          </div>
          <div className="stat-card-metric text-amber">{stats.highPriority}</div>
          <span className="stat-card-trend">Urgent attention items</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Chart 1: Tasks by Status (SVG Donut Chart) */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tasks by Status</h3>
            <span className="chart-subtitle">Status volume breakdown</span>
          </div>

          <div className="donut-chart-container">
            <div className="donut-svg-wrap">
              <svg width="160" height="160" viewBox="0 0 160 160" className="donut-svg">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="18"
                />
                {total > 0 && (
                  <>
                    {/* Completed Ring (Green) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray={`${strokeCompleted} ${circumference}`}
                      strokeDashoffset={offsetCompleted}
                      transform="rotate(-90 80 80)"
                    />
                    {/* In Progress Ring (Blue) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="18"
                      strokeDasharray={`${strokeProgress} ${circumference}`}
                      strokeDashoffset={offsetProgress}
                      transform="rotate(-90 80 80)"
                    />
                    {/* Todo Ring (Slate) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="18"
                      strokeDasharray={`${strokeTodo} ${circumference}`}
                      strokeDashoffset={offsetTodo}
                      transform="rotate(-90 80 80)"
                    />
                  </>
                )}
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-number">{total}</span>
                <span className="donut-center-label">Total</span>
              </div>
            </div>

            <div className="chart-legend-list">
              <div className="chart-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                <span className="legend-name">Completed</span>
                <span className="legend-val">{completed} ({pCompleted.toFixed(0)}%)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }} />
                <span className="legend-name">In Progress</span>
                <span className="legend-val">{inProgress} ({pInProgress.toFixed(0)}%)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#94a3b8' }} />
                <span className="legend-name">Todo</span>
                <span className="legend-val">{todo} ({pTodo.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Tasks by Priority (Horizontal Bar Breakdown) */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tasks by Priority</h3>
            <span className="chart-subtitle">Workload severity tiers</span>
          </div>

          <div className="priority-bars-container">
            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span className="priority-badge-label text-danger">
                  <Flame size={14} /> High Priority
                </span>
                <span className="priority-bar-count">{highCount} tasks</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-danger"
                  style={{ width: `${(highCount / maxPriority) * 100}%` }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span className="priority-badge-label text-amber">
                  Medium Priority
                </span>
                <span className="priority-bar-count">{medCount} tasks</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-amber"
                  style={{ width: `${(medCount / maxPriority) * 100}%` }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span className="priority-badge-label text-emerald">
                  Low Priority
                </span>
                <span className="priority-bar-count">{lowCount} tasks</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-emerald"
                  style={{ width: `${(lowCount / maxPriority) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Weekly Productivity (7-Day Completion Velocity) */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Weekly Productivity Velocity</h3>
            <span className="chart-subtitle">Tasks resolved per day (past 7 days)</span>
          </div>

          <div className="vertical-bar-chart">
            {weekly.days.map((item, idx) => {
              const heightPct = maxWeekly > 0 ? (item.completed / maxWeekly) * 85 : 0;
              return (
                <div key={idx} className="chart-bar-column">
                  <div className="bar-column-metric">{item.completed}</div>
                  <div className="bar-column-track">
                    <div
                      className="bar-column-fill bg-primary"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    />
                  </div>
                  <span className="bar-column-label">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Upcoming Deadlines (Next 7 Days) */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Upcoming Deadlines</h3>
            <span className="chart-subtitle">Deadlines schedule (next 7 days)</span>
          </div>

          <div className="vertical-bar-chart">
            {next7Days.map((item, idx) => {
              const heightPct = maxDeadlines > 0 ? (item.count / maxDeadlines) * 85 : 0;
              return (
                <div key={idx} className="chart-bar-column">
                  <div className="bar-column-metric">{item.count}</div>
                  <div className="bar-column-track">
                    <div
                      className="bar-column-fill bg-violet"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    />
                  </div>
                  <span className="bar-column-label">{item.label.split(',')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
