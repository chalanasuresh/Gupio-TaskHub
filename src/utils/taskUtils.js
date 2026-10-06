/**
 * Task helper utilities: date logic, statistics, sorting, filtering, validation, and analytics calculations.
 */

/**
 * Returns today's date as 'YYYY-MM-DD' in local time.
 */
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a task is overdue (due date < today and status is not 'Completed').
 */
export function isTaskOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false;
  const today = getTodayDateString();
  return dueDate < today;
}

/**
 * Checks if a task is due today and not yet completed.
 */
export function isTaskDueToday(dueDate, status) {
  if (!dueDate || status === 'Completed') return false;
  const today = getTodayDateString();
  return dueDate === today;
}

/**
 * Formats a YYYY-MM-DD or ISO string into a human-friendly format (e.g., "Oct 7, 2026").
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats ISO date string into readable date and time (e.g., "Oct 4, 2026, 3:25 PM").
 */
export function formatDateTime(isoStr) {
  if (!isoStr) return 'N/A';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

/**
 * Dynamically computes task statistics from an array of tasks.
 */
export function calculateTaskStatistics(tasks = []) {
  const total = tasks.length;
  let todo = 0;
  let inProgress = 0;
  let completed = 0;
  let highPriority = 0;
  let overdue = 0;
  let dueToday = 0;

  for (const task of tasks) {
    if (task.status === 'Todo') todo++;
    if (task.status === 'In Progress') inProgress++;
    if (task.status === 'Completed') completed++;
    if (task.priority === 'High') highPriority++;
    if (isTaskOverdue(task.dueDate, task.status)) overdue++;
    if (isTaskDueToday(task.dueDate, task.status)) dueToday++;
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    completed,
    highPriority,
    overdue,
    dueToday,
    completionRate,
  };
}

/**
 * Enhanced global search & filter logic.
 * Searches across: title, description, status, priority.
 */
export function filterAndSortTasks(tasks = [], filters = {}) {
  const {
    search = '',
    statusFilter = 'All',
    priorityFilter = 'All',
    sortBy = 'newest',
  } = filters;

  const normalizedSearch = search.trim().toLowerCase();

  return tasks
    .filter((task) => {
      // Global Search: Title, Description, Status, Priority
      if (normalizedSearch) {
        const titleMatch = (task.title || '').toLowerCase().includes(normalizedSearch);
        const descMatch = (task.description || '').toLowerCase().includes(normalizedSearch);
        const statusMatch = (task.status || '').toLowerCase().includes(normalizedSearch);
        const priorityMatch = (task.priority || '').toLowerCase().includes(normalizedSearch);
        if (!titleMatch && !descMatch && !statusMatch && !priorityMatch) return false;
      }

      // Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Overdue') {
          if (!isTaskOverdue(task.dueDate, task.status)) return false;
        } else if (statusFilter === 'Due Today') {
          if (!isTaskDueToday(task.dueDate, task.status)) return false;
        } else if (task.status !== statusFilter) {
          return false;
        }
      }

      // Priority Filter
      if (priorityFilter !== 'All') {
        if (task.priority !== priorityFilter) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'dueDate':
        case 'dueDateAsc':
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        case 'dueDateDesc':
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        case 'priority': {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          const pA = priorityWeight[a.priority] || 0;
          const pB = priorityWeight[b.priority] || 0;
          return pB - pA;
        }
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
}

/**
 * Validates task form data before create or update.
 */
export function validateTask(formData) {
  const errors = {};

  const title = (formData.title || '').trim();
  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length < 3) {
    errors.title = 'Task title must be at least 3 characters long.';
  } else if (title.length > 100) {
    errors.title = 'Task title cannot exceed 100 characters.';
  }

  const description = (formData.description || '').trim();
  if (description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  const validStatuses = ['Todo', 'In Progress', 'Completed'];
  if (!formData.status || !validStatuses.includes(formData.status)) {
    errors.status = 'Please select a valid task status.';
  }

  const validPriorities = ['Low', 'Medium', 'High'];
  if (!formData.priority || !validPriorities.includes(formData.priority)) {
    errors.priority = 'Please select a valid priority level.';
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else {
    const parsedDate = new Date(formData.dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Please select a valid calendar date.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/* ==========================================================================
   ANALYTICS & SMART DASHBOARD CALCULATIONS
   ========================================================================== */

/**
 * Returns tasks due in the next `days` (including today) that are not completed.
 */
export function getUpcomingDeadlines(tasks = [], days = 7) {
  const today = getTodayDateString();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + days);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return tasks
    .filter((t) => t.dueDate >= today && t.dueDate <= maxDateStr && t.status !== 'Completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/**
 * Returns tasks for today's focus (due today or high priority not completed).
 */
export function getTodayFocusTasks(tasks = []) {
  return tasks.filter(
    (t) => (isTaskDueToday(t.dueDate, t.status) || t.priority === 'High') && t.status !== 'Completed'
  );
}

/**
 * Returns all active overdue tasks.
 */
export function getOverdueTasks(tasks = []) {
  return tasks
    .filter((t) => isTaskOverdue(t.dueDate, t.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/**
 * Returns most recently completed tasks (up to limit).
 */
export function getRecentlyCompletedTasks(tasks = [], limit = 5) {
  return tasks
    .filter((t) => t.status === 'Completed')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, limit);
}

/**
 * Calculates productivity metrics for the past 7 days.
 */
export function getWeeklyProductivity(tasks = []) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    // Count tasks completed on this date
    const completedCount = tasks.filter((t) => {
      if (t.status !== 'Completed') return false;
      const taskUpdatedDate = (t.updatedAt || t.createdAt || '').split('T')[0];
      return taskUpdatedDate === dateStr;
    }).length;

    result.push({
      date: dateStr,
      day: dayLabel,
      completed: completedCount,
    });
  }

  const totalThisWeek = result.reduce((acc, curr) => acc + curr.completed, 0);

  return {
    days: result,
    totalThisWeek,
  };
}

/**
 * Returns distribution counts for next 7 days for deadline charts.
 */
export function getNext7DaysDistribution(tasks = []) {
  const result = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

    const count = tasks.filter((t) => t.dueDate === dateStr && t.status !== 'Completed').length;

    result.push({
      date: dateStr,
      label: dayLabel,
      count,
    });
  }

  return result;
}
