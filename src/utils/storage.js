/**
 * Storage utilities for TaskHub
 * Manages localStorage persistence for Tasks, Users, Current User, Theme, Notifications, Preferences, and Health Reminders.
 */

export const STORAGE_KEYS = {
  TASKS: 'gupio_tasks',
  USERS: 'gupio_users',
  CURRENT_USER: 'gupio_current_user',
  THEME: 'gupio_theme',
  NOTIFICATIONS: 'gupio_notifications',
  PREFERENCES: 'gupio_preferences',
  HEALTH_REMINDERS: 'taskhub_health_reminders',
};

/**
 * Default demonstration user pre-loaded for frictionless testing.
 */
export const DEFAULT_DEMO_USER = {
  id: 'user-demo-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@taskhub.dev',
  password: 'password123', // Frontend demonstration credential
  avatarInitials: 'AM',
  avatarColor: '#2563eb',
  createdAt: '2026-09-15T08:00:00.000Z',
};

/**
 * Helper to compute an ISO date string (YYYY-MM-DD) offset by `days` from today.
 */
function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Realistic default workplace tasks to populate when localStorage is empty.
 * Associated with the demo user.
 */
export const SAMPLE_TASKS = [
  {
    id: 'task-1',
    userId: 'user-demo-1',
    title: 'Prepare weekly project report',
    description: 'Compile team deliverables, velocity metrics, and blockers for the engineering leads meeting.',
    status: 'In Progress',
    priority: 'High',
    dueDate: getDateOffset(1), // Tomorrow
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task-2',
    userId: 'user-demo-1',
    title: 'Review employee onboarding checklist',
    description: 'Verify access provisioning, equipment distribution, and mentor assignment for new hires.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: getDateOffset(3), // in 3 days
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'task-3',
    userId: 'user-demo-1',
    title: 'Complete UI accessibility audit',
    description: 'Audit color contrast ratios, ARIA labels, and keyboard tab sequences across all main modals.',
    status: 'Todo',
    priority: 'High',
    dueDate: getDateOffset(-1), // Overdue!
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-4',
    userId: 'user-demo-1',
    title: 'Test dashboard responsive layout',
    description: 'Verify desktop (1440px), tablet (768px), and mobile (390px) viewports for edge overflows.',
    status: 'In Progress',
    priority: 'High',
    dueDate: getDateOffset(0), // Due Today!
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'task-5',
    userId: 'user-demo-1',
    title: 'Schedule client feedback meeting',
    description: 'Coordinate with product managers to align on Q4 client roadmap demos and feature reviews.',
    status: 'Completed',
    priority: 'Low',
    dueDate: getDateOffset(-2), // 2 days ago, completed
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: 'task-6',
    userId: 'user-demo-1',
    title: 'Update project documentation',
    description: 'Document component hierarchies, custom hooks, and state management patterns in README.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: getDateOffset(4),
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
  },
  {
    id: 'task-7',
    userId: 'user-demo-1',
    title: 'Prepare sprint presentation',
    description: 'Draft key presentation slides highlighting frontend milestone accomplishments and QA pass rates.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: getDateOffset(6),
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'task-8',
    userId: 'user-demo-1',
    title: 'Review pending support requests',
    description: 'Triage customer inquiries from ticket queues and assign urgent bugs to on-call developers.',
    status: 'Completed',
    priority: 'Low',
    dueDate: getDateOffset(-3),
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

/* ==========================================================================
   USER & AUTHENTICATION STORAGE
   ========================================================================== */

/**
 * Loads all registered users from localStorage.
 */
export function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      saveUsersToStorage([DEFAULT_DEMO_USER]);
      return [DEFAULT_DEMO_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveUsersToStorage([DEFAULT_DEMO_USER]);
      return [DEFAULT_DEMO_USER];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading users from storage:', err);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Persists all users to localStorage.
 */
export function saveUsersToStorage(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (err) {
    console.error('Failed to save users:', err);
    return false;
  }
}

/**
 * Loads current authenticated user.
 * Defaults to DEFAULT_DEMO_USER on initial load if no explicit logout occurred.
 */
export function getCurrentUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw === 'null') return null;
    if (!raw) {
      // First visit: auto-login demo user for seamless evaluation
      saveCurrentUserToStorage(DEFAULT_DEMO_USER);
      return DEFAULT_DEMO_USER;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading current user:', err);
    return null;
  }
}

/**
 * Sets current authenticated user, or clears if null.
 */
export function saveCurrentUserToStorage(user) {
  try {
    if (user === null) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'null');
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    return true;
  } catch (err) {
    console.error('Failed to save current user:', err);
    return false;
  }
}

/**
 * Helper to generate avatar initials from full name.
 */
export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Registers a new user.
 */
export function registerUser({ name, email, password }) {
  const users = loadUsersFromStorage();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777', '#0891b2'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    avatarInitials: getInitials(name),
    avatarColor: randomColor,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsersToStorage(updatedUsers);
  saveCurrentUserToStorage(newUser);

  // Seed sample tasks & wellness reminders for new users
  resetUserTasksToSample(newUser.id);
  saveHealthRemindersToStorage(newUser.id, SAMPLE_HEALTH_REMINDERS);

  return { success: true, user: newUser };
}

/**
 * Authenticates user credentials.
 */
export function authenticateUser(email, password) {
  const users = loadUsersFromStorage();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail ||
      (normalizedEmail === 'alex.morgan@taskhub.dev' && u.email.toLowerCase() === 'alex.morgan@gupio.dev') ||
      (normalizedEmail === 'alex.morgan@gupio.dev' && u.email.toLowerCase() === 'alex.morgan@taskhub.dev')
  );
  if (!user) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  saveCurrentUserToStorage(user);
  return { success: true, user };
}

/* ==========================================================================
   TASK STORAGE PER USER
   ========================================================================== */

/**
 * Loads all tasks from localStorage.
 */
export function loadAllTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveAllTasksToStorage(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      saveAllTasksToStorage(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading tasks from localStorage:', err);
    saveAllTasksToStorage(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  }
}

/**
 * Persists all tasks to localStorage.
 */
export function saveAllTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    return false;
  }
}

/**
 * Loads tasks filtered for a specific user ID.
 * If user has no tasks and is the default demo user, returns SAMPLE_TASKS.
 */
export function loadTasksForUser(userId) {
  const allTasks = loadAllTasksFromStorage();
  if (!userId) return allTasks;

  const userTasks = allTasks.filter((t) => (t.userId || 'user-demo-1') === userId);
  return userTasks;
}

/**
 * Saves tasks for a specific user ID while preserving tasks of other users.
 */
export function saveTasksForUser(userId, tasksForUser) {
  const allTasks = loadAllTasksFromStorage();
  const targetUserId = userId || 'user-demo-1';

  // Keep other users' tasks
  const otherTasks = allTasks.filter((t) => (t.userId || 'user-demo-1') !== targetUserId);

  // Ensure current user's tasks have their userId
  const stampedUserTasks = tasksForUser.map((t) => ({
    ...t,
    userId: targetUserId,
  }));

  const updatedAll = [...stampedUserTasks, ...otherTasks];
  return saveAllTasksToStorage(updatedAll);
}

/**
 * Resets tasks to sample tasks for the specified user.
 */
export function resetUserTasksToSample(userId = 'user-demo-1') {
  const stampedSamples = SAMPLE_TASKS.map((t) => ({ ...t, userId }));
  saveTasksForUser(userId, stampedSamples);
  return stampedSamples;
}

// Backward-compatible aliases for existing codebase
export const loadTasksFromStorage = loadAllTasksFromStorage;
export const saveTasksToStorage = saveAllTasksToStorage;
export const resetStorageWithSampleTasks = () => {
  saveAllTasksToStorage(SAMPLE_TASKS);
  return SAMPLE_TASKS;
};

/* ==========================================================================
   THEME PERSISTENCE
   ========================================================================== */

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (err) {
    console.error('Failed to set theme:', err);
  }
}

/* ==========================================================================
   NOTIFICATIONS PERSISTENCE
   ========================================================================== */

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-sample-1',
    signature: 'due-today-1',
    title: '⚠️ Task Due Today',
    message: 'Prepare Sprint 4 demo presentation is scheduled for completion today.',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-health-1',
    signature: 'health-vitamin-1',
    title: '💊 Vitamin tablet reminder',
    message: 'Scheduled reminder for 8:00 PM today. Keep consistent with daily wellness routines.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-sample-2',
    signature: 'welcome-1',
    title: '👋 Welcome to TaskHub',
    message: 'Your personal workspace is ready. Plan, prioritize, and get things done!',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export function loadNotificationsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      saveNotificationsToStorage(SAMPLE_NOTIFICATIONS);
      return SAMPLE_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_NOTIFICATIONS;
  } catch {
    return SAMPLE_NOTIFICATIONS;
  }
}

export function saveNotificationsToStorage(notifications) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return true;
  } catch {
    return false;
  }
}

/* ==========================================================================
   PREFERENCES PERSISTENCE
   ========================================================================== */

export const DEFAULT_PREFERENCES = {
  defaultView: 'grid', // 'grid' | 'table' | 'board'
  notificationsEnabled: true,
  overdueAlerts: true,
  dailyDigest: true,
};

export function loadPreferencesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferencesToStorage(prefs) {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

/* ==========================================================================
   DATA EXPORT HELPERS (CSV & JSON)
   ========================================================================== */

export function exportTasksToCSV(tasks = []) {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At', 'Updated At'];
  const rows = tasks.map((t) => [
    t.id,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    t.dueDate,
    t.createdAt,
    t.updatedAt,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `taskhub-tasks-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTasksToJSON(tasks = []) {
  const jsonContent = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `taskhub-tasks-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   HEALTH REMINDERS STORAGE
   ========================================================================== */

export const SAMPLE_HEALTH_REMINDERS = [
  {
    id: 'health-1',
    userId: 'user-demo-1',
    name: 'Vitamin tablet',
    description: 'Take with dinner and a glass of water',
    time: '8:00 PM',
    date: new Date().toISOString().split('T')[0],
    frequency: 'Daily',
    category: 'Medication',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'health-2',
    userId: 'user-demo-1',
    name: 'Hydration check (500ml)',
    description: 'Drink fresh water between sprint tasks',
    time: '2:00 PM',
    date: new Date().toISOString().split('T')[0],
    frequency: 'Daily',
    category: 'Water',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'health-3',
    userId: 'user-demo-1',
    name: 'Posture stretch & quick walk',
    description: '5-minute standing spine stretch and hallway walk',
    time: '4:30 PM',
    date: new Date().toISOString().split('T')[0],
    frequency: 'Weekdays',
    category: 'Exercise',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'health-4',
    userId: 'user-demo-1',
    name: 'Eye break (20-20-20 rule)',
    description: 'Rest eyes by looking at an object 20 feet away for 20 seconds',
    time: '11:30 AM',
    date: new Date().toISOString().split('T')[0],
    frequency: 'Daily',
    category: 'General Wellness',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
];

export function loadHealthRemindersFromStorage(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_REMINDERS);
    if (!raw) {
      saveHealthRemindersToStorage(userId, SAMPLE_HEALTH_REMINDERS);
      return SAMPLE_HEALTH_REMINDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveHealthRemindersToStorage(userId, SAMPLE_HEALTH_REMINDERS);
      return SAMPLE_HEALTH_REMINDERS;
    }
    if (userId) {
      const userReminders = parsed.filter((r) => (r.userId || 'user-demo-1') === userId);
      return userReminders.length > 0 ? userReminders : SAMPLE_HEALTH_REMINDERS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading health reminders:', err);
    return SAMPLE_HEALTH_REMINDERS;
  }
}

export function saveHealthRemindersToStorage(userId, reminders) {
  try {
    let all = [];
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_REMINDERS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) all = parsed;
      } catch {}
    }
    const otherUsers = all.filter((r) => (r.userId || 'user-demo-1') !== userId);
    const updated = [...otherUsers, ...reminders];
    localStorage.setItem(STORAGE_KEYS.HEALTH_REMINDERS, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save health reminders:', err);
    return false;
  }
}
