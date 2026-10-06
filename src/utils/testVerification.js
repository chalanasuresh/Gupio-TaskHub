/**
 * Automated Verification Script for Gupio TaskHub
 * Validates storage, taskUtils, calculations, filtering, sorting, and validation rules.
 */

import {
  isTaskOverdue,
  isTaskDueToday,
  calculateTaskStatistics,
  filterAndSortTasks,
  validateTask,
  getTodayDateString,
} from './taskUtils.js';

import { SAMPLE_TASKS } from './storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- RUNNING GUPIO TASKHUB VERIFICATION TESTS ---');

// 1. Test Task Model & Sample Tasks
console.log('\n[1] Verifying Sample Tasks & Model Structure');
assert(Array.isArray(SAMPLE_TASKS) && SAMPLE_TASKS.length >= 6, 'Contains 6-8 sample tasks');
const sample = SAMPLE_TASKS[0];
assert(
  Boolean(sample.id && sample.title && sample.status && sample.priority && sample.dueDate && sample.createdAt && sample.updatedAt),
  'Task model contains id, title, status, priority, dueDate, createdAt, updatedAt'
);

// 2. Test Dynamic Statistics Calculation
console.log('\n[2] Verifying Dynamic Statistics Calculation');
const stats = calculateTaskStatistics(SAMPLE_TASKS);
assert(stats.total === SAMPLE_TASKS.length, `Total tasks count: ${stats.total}`);
assert(stats.todo >= 0, `Todo count: ${stats.todo}`);
assert(stats.inProgress >= 0, `In Progress count: ${stats.inProgress}`);
assert(stats.completed >= 0, `Completed count: ${stats.completed}`);
assert(stats.highPriority >= 0, `High priority count: ${stats.highPriority}`);
assert(stats.total === stats.todo + stats.inProgress + stats.completed, 'Sum of statuses equals total tasks');
assert(stats.completionRate >= 0 && stats.completionRate <= 100, `Completion rate: ${stats.completionRate}%`);

// 3. Test Date Indicators (Overdue, Due Today)
console.log('\n[3] Verifying Overdue and Due Today Logic');
const todayStr = getTodayDateString();
const pastDate = '2020-01-01';
const futureDate = '2030-01-01';

assert(isTaskOverdue(pastDate, 'Todo') === true, 'Past due date with Todo status is marked Overdue');
assert(isTaskOverdue(pastDate, 'Completed') === false, 'Past due date with Completed status is NOT marked Overdue');
assert(isTaskOverdue(futureDate, 'Todo') === false, 'Future due date is NOT marked Overdue');
assert(isTaskDueToday(todayStr, 'Todo') === true, "Today's date with Todo is marked Due Today");
assert(isTaskDueToday(todayStr, 'Completed') === false, "Today's date with Completed is NOT marked Due Today");

// 4. Test Form Validation
console.log('\n[4] Verifying Form Validation Rules');
const emptyRes = validateTask({});
assert(!emptyRes.isValid, 'Empty form is invalid');
assert(emptyRes.errors.title === 'Task title is required.', 'Requires title message');
assert(emptyRes.errors.dueDate === 'Due date is required.', 'Requires due date message');

const shortRes = validateTask({ title: 'ab', status: 'Todo', priority: 'High', dueDate: todayStr });
assert(!shortRes.isValid && shortRes.errors.title.includes('at least 3 characters'), 'Rejects title shorter than 3 characters');

const validRes = validateTask({
  title: 'Prepare presentation',
  description: 'Valid workplace description',
  status: 'In Progress',
  priority: 'High',
  dueDate: todayStr,
});
assert(validRes.isValid && Object.keys(validRes.errors).length === 0, 'Accepts valid task inputs');

// 5. Test Search Filtering (Title and Description)
console.log('\n[5] Verifying Search Functionality');
const searchedByTitle = filterAndSortTasks(SAMPLE_TASKS, { search: 'onboarding' });
assert(searchedByTitle.length >= 1 && searchedByTitle[0].title.toLowerCase().includes('onboarding'), 'Search by title works');

const searchedByDesc = filterAndSortTasks(SAMPLE_TASKS, { search: 'accessibility' });
assert(searchedByDesc.length >= 1, 'Search by description matches');

const searchNotFound = filterAndSortTasks(SAMPLE_TASKS, { search: 'nonexistentkeywordxyz' });
assert(searchNotFound.length === 0, 'Non-matching search returns empty array');

// 6. Test Status Filtering
console.log('\n[6] Verifying Status Filtering');
const todoTasks = filterAndSortTasks(SAMPLE_TASKS, { statusFilter: 'Todo' });
assert(todoTasks.every((t) => t.status === 'Todo'), 'Todo status filter only returns Todo tasks');

const completedTasks = filterAndSortTasks(SAMPLE_TASKS, { statusFilter: 'Completed' });
assert(completedTasks.every((t) => t.status === 'Completed'), 'Completed status filter only returns Completed tasks');

// 7. Test Priority Filtering
console.log('\n[7] Verifying Priority Filtering');
const highPriority = filterAndSortTasks(SAMPLE_TASKS, { priorityFilter: 'High' });
assert(highPriority.every((t) => t.priority === 'High'), 'Priority filter only returns High priority tasks');

// 8. Test Sorting
console.log('\n[8] Verifying Sorting Modes');
const sortedPriority = filterAndSortTasks(SAMPLE_TASKS, { sortBy: 'priority' });
const weights = { High: 3, Medium: 2, Low: 1 };
let correctlySortedPriority = true;
for (let i = 0; i < sortedPriority.length - 1; i++) {
  if (weights[sortedPriority[i].priority] < weights[sortedPriority[i + 1].priority]) {
    correctlySortedPriority = false;
    break;
  }
}
assert(correctlySortedPriority, 'Priority sort orders tasks High -> Medium -> Low');

const sortedDueAsc = filterAndSortTasks(SAMPLE_TASKS, { sortBy: 'dueDateAsc' });
let correctlySortedDue = true;
for (let i = 0; i < sortedDueAsc.length - 1; i++) {
  if (sortedDueAsc[i].dueDate > sortedDueAsc[i + 1].dueDate) {
    correctlySortedDue = false;
    break;
  }
}
assert(correctlySortedDue, 'Due date sort orders earliest first');

console.log(`\n========================================`);
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
