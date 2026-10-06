/**
 * Storage utilities for Gupio TaskHub
 * Manages localStorage persistence with resilient fallback and error handling.
 */

const STORAGE_KEY = 'gupio_tasks';

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
 * Uses dynamic date offsets so "Overdue", "Due Today", and future tasks work regardless of when tested.
 */
export const SAMPLE_TASKS = [
  {
    id: 'task-1',
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
    title: 'Review pending support requests',
    description: 'Triage customer inquiries from ticket queues and assign urgent bugs to on-call developers.',
    status: 'Completed',
    priority: 'Low',
    dueDate: getDateOffset(-3),
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

/**
 * Loads tasks from localStorage.
 * If data is absent, invalid, or corrupted, initializes with SAMPLE_TASKS.
 */
export function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run: save sample tasks
      saveTasksToStorage(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage data is not an array. Resetting with sample tasks.');
      saveTasksToStorage(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading tasks from localStorage:', err);
    saveTasksToStorage(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  }
}

/**
 * Persists an array of tasks to localStorage.
 * Returns true if successful, false otherwise.
 */
export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    return false;
  }
}

/**
 * Resets localStorage to fresh initial sample tasks.
 */
export function resetStorageWithSampleTasks() {
  saveTasksToStorage(SAMPLE_TASKS);
  return SAMPLE_TASKS;
}
