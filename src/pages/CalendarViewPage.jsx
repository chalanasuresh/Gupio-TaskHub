import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { isTaskOverdue, getTodayDateString } from '../utils/taskUtils';

export default function CalendarViewPage({
  tasks = [],
  onViewTask,
  onCreateTaskWithDate,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = getTodayDateString();

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  // Generate calendar grid matrix (42 cells: 6 rows * 7 cols)
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = prevDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(month + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    const dateStr = `${year}-${m}-${day}`;
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days to complete grid
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(year, month + 1, d);
    const dateStr = nextDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="calendar-view-wrapper">
      {/* Calendar Header Controls */}
      <div className="calendar-controls-bar">
        <div className="calendar-month-heading">
          <h2 className="calendar-title">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="calendar-actions-group">
          <button
            type="button"
            className="btn btn-secondary btn-calendar-today"
            onClick={goToToday}
          >
            Today
          </button>
          <div className="calendar-nav-buttons">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={prevMonth}
              title="Previous Month"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={nextMonth}
              title="Next Month"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="calendar-grid-container">
        {/* Day of Week Headers */}
        <div className="calendar-weekdays-row">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw) => (
            <div key={dw} className="calendar-weekday-cell">
              {dw}
            </div>
          ))}
        </div>

        {/* 6x7 Day Cells */}
        <div className="calendar-days-grid">
          {calendarCells.map((cell, idx) => {
            const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);

            return (
              <div
                key={idx}
                className={`calendar-day-cell ${
                  cell.isCurrentMonth ? 'in-month' : 'out-of-month'
                } ${cell.isToday ? 'is-today' : ''}`}
              >
                <div className="day-cell-header">
                  <span className={`day-number ${cell.isToday ? 'today-pill' : ''}`}>
                    {cell.dayNum}
                  </span>
                  {cell.isCurrentMonth && onCreateTaskWithDate && (
                    <button
                      type="button"
                      className="day-add-task-btn"
                      onClick={() => onCreateTaskWithDate(cell.dateStr)}
                      title={`Add task on ${cell.dateStr}`}
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="day-tasks-container">
                  {dayTasks.map((t) => {
                    const isOverdue = isTaskOverdue(t.dueDate, t.status);
                    const isCompleted = t.status === 'Completed';

                    return (
                      <div
                        key={t.id}
                        className={`calendar-task-pill priority-${t.priority.toLowerCase()} ${
                          isCompleted ? 'task-completed' : ''
                        } ${isOverdue ? 'task-overdue' : ''}`}
                        onClick={() => onViewTask(t)}
                        title={`${t.title} (${t.priority} • ${t.status})`}
                      >
                        <span className={`calendar-task-dot dot-${t.priority.toLowerCase()}`} />
                        <span className="calendar-task-text">{t.title}</span>
                        {isCompleted && <CheckCircle2 size={11} className="text-emerald" />}
                        {isOverdue && <AlertCircle size={11} className="text-rose-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
