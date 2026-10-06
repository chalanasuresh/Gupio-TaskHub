import React, { useState, useMemo, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { NotificationProvider } from './context/NotificationContext';

import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';
import { filterAndSortTasks } from './utils/taskUtils';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import KanbanBoardPage from './pages/KanbanBoardPage';
import CalendarViewPage from './pages/CalendarViewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import ConfirmDialog from './components/ConfirmDialog';
import ExportModal from './components/ExportModal';
import Toast from './components/Toast';

/**
 * Inner workspace application shell rendered within Auth, Theme, Router, and Notification contexts.
 */
function WorkspaceShell() {
  const { currentPath, navigate } = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  const {
    tasks,
    stats,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetTasks,
    clearAllTasks,
  } = useTasks(currentUser?.id);

  const { toasts, showToast, removeToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Mobile navigation drawer state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState('Todo');
  const [initialTaskDate, setInitialTaskDate] = useState(null);

  // Compute filtered tasks
  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      search: searchQuery,
      statusFilter,
      priorityFilter,
      sortBy,
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      statusFilter !== 'All' ||
      priorityFilter !== 'All' ||
      sortBy !== 'newest'
    );
  }, [searchQuery, statusFilter, priorityFilter, sortBy]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('newest');
  }, []);

  // Form submission (Create & Edit)
  const handleFormSubmit = useCallback(
    (formData) => {
      if (taskToEdit) {
        const result = updateTask(taskToEdit.id, formData);
        if (result.success) {
          showToast(`Task "${formData.title}" updated successfully.`, 'success');
          setIsFormOpen(false);
          setTaskToEdit(null);
        } else {
          showToast(
            result.errors?.title || result.errors?.general || 'Failed to update task.',
            'error'
          );
        }
      } else {
        const result = createTask(formData);
        if (result.success) {
          showToast(`Task "${formData.title}" created successfully.`, 'success');
          setIsFormOpen(false);
        } else {
          showToast(
            result.errors?.title || 'Failed to create task. Please check form inputs.',
            'error'
          );
        }
      }
    },
    [taskToEdit, createTask, updateTask, showToast]
  );

  // Delete task with confirmation
  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return;
    const taskTitle = taskToDelete.title;
    const result = deleteTask(taskToDelete.id);
    if (result.success) {
      showToast(`Task "${taskTitle}" deleted.`, 'success');
      if (taskToView && taskToView.id === taskToDelete.id) {
        setTaskToView(null);
      }
    } else {
      showToast('Could not delete task.', 'error');
    }
    setTaskToDelete(null);
  }, [taskToDelete, deleteTask, taskToView, showToast]);

  // Quick status toggle (Kanban drag-and-drop, card click, table switcher)
  const handleStatusChange = useCallback(
    (id, newStatus) => {
      const ok = updateTaskStatus(id, newStatus);
      if (ok) {
        showToast(`Moved to "${newStatus}".`, 'info', 2200);
        if (taskToView && taskToView.id === id) {
          setTaskToView((prev) => ({ ...prev, status: newStatus }));
        }
      }
    },
    [updateTaskStatus, taskToView, showToast]
  );

  // Open Create Modal with optional initial status or due date
  const handleOpenCreateModal = useCallback((status = 'Todo', dueDate = null) => {
    setTaskToEdit(null);
    setInitialTaskStatus(status);
    setInitialTaskDate(dueDate);
    setIsFormOpen(true);
  }, []);

  // Open Edit Modal
  const handleOpenEditModal = useCallback((task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  }, []);

  // Reset to initial sample tasks
  const handleConfirmReset = useCallback(() => {
    resetTasks();
    setIsResetConfirmOpen(false);
    handleResetFilters();
    showToast('Sample workplace tasks restored successfully.', 'success');
  }, [resetTasks, handleResetFilters, showToast]);

  // Clear all tasks
  const handleClearAllTasks = useCallback(() => {
    clearAllTasks();
    handleResetFilters();
    showToast('All tasks have been purged from your account.', 'warning');
  }, [clearAllTasks, handleResetFilters, showToast]);

  // Page title mapping
  const pageMeta = useMemo(() => {
    switch (currentPath) {
      case '/tasks':
        return {
          title: 'Task Backlog',
          subtitle: 'Comprehensive view of all your team deliverables and assignments.',
        };
      case '/board':
        return {
          title: 'Kanban Sprint Board',
          subtitle: 'Interactive drag-and-drop progression across sprint columns.',
        };
      case '/calendar':
        return {
          title: 'Deadlines Calendar',
          subtitle: 'Visualize milestone dates, deadlines, and scheduled priorities.',
        };
      case '/analytics':
        return {
          title: 'Performance Analytics',
          subtitle: 'Velocity metrics, completion ratios, and workload distributions.',
        };
      case '/profile':
        return {
          title: 'Account Profile',
          subtitle: 'Manage your credentials, display settings, and avatar tone.',
        };
      case '/settings':
        return {
          title: 'Workspace Settings',
          subtitle: 'Customize appearance, notification alerts, and data exports.',
        };
      case '/dashboard':
      case '/':
      default:
        return {
          title: 'Dashboard Overview',
          subtitle: 'Track deadlines, balance priorities, and streamline daily productivity.',
        };
    }
  }, [currentPath]);

  // 1. If user is on authentication routes
  if (!isAuthenticated || currentPath === '/login') {
    return (
      <>
        <Toast toasts={toasts} onDismiss={removeToast} />
        <LoginPage />
      </>
    );
  }

  if (currentPath === '/signup') {
    return (
      <>
        <Toast toasts={toasts} onDismiss={removeToast} />
        <SignupPage />
      </>
    );
  }

  // 2. Render authenticated application shell
  return (
    <div className="app-shell">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Dark Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpenMobile}
        onClose={() => setIsSidebarOpenMobile(false)}
        stats={stats}
        onResetDataClick={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="app-main-layout">
        <Header
          pageTitle={pageMeta.title}
          pageSubtitle={pageMeta.subtitle}
          onOpenSidebar={() => setIsSidebarOpenMobile(true)}
          onOpenCreateTask={() => handleOpenCreateModal('Todo')}
          onOpenExport={() => setIsExportOpen(true)}
          onViewTask={(taskId) => {
            const found = tasks.find((t) => t.id === taskId);
            if (found) setTaskToView(found);
          }}
          globalSearch={searchQuery}
          onGlobalSearchChange={setSearchQuery}
          showSearch={currentPath === '/dashboard' || currentPath === '/' || currentPath === '/tasks'}
        />

        <main className="app-content-body">
          {/* Route View Switching */}
          {(currentPath === '/dashboard' || currentPath === '/') && (
            <DashboardPage
              tasks={tasks}
              stats={stats}
              filteredTasks={filteredTasks}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
              onViewTask={(task) => setTaskToView(task)}
              onEditTask={handleOpenEditModal}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onStatusChange={handleStatusChange}
              onCreateTask={() => handleOpenCreateModal('Todo')}
              onResetTasks={() => setIsResetConfirmOpen(true)}
              onNavigate={navigate}
            />
          )}

          {currentPath === '/tasks' && (
            <TasksPage
              tasks={tasks}
              filteredTasks={filteredTasks}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
              onViewTask={(task) => setTaskToView(task)}
              onEditTask={handleOpenEditModal}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onStatusChange={handleStatusChange}
              onCreateTask={() => handleOpenCreateModal('Todo')}
              onResetTasks={() => setIsResetConfirmOpen(true)}
            />
          )}

          {currentPath === '/board' && (
            <KanbanBoardPage
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onView={(task) => setTaskToView(task)}
              onEdit={handleOpenEditModal}
              onDelete={(task) => setTaskToDelete(task)}
              onCreateTask={(colStatus) => handleOpenCreateModal(colStatus)}
            />
          )}

          {currentPath === '/calendar' && (
            <CalendarViewPage
              tasks={tasks}
              onViewTask={(task) => setTaskToView(task)}
              onCreateTaskWithDate={(dateStr) => handleOpenCreateModal('Todo', dateStr)}
            />
          )}

          {currentPath === '/analytics' && (
            <AnalyticsPage tasks={tasks} stats={stats} />
          )}

          {currentPath === '/profile' && (
            <ProfilePage stats={stats} onShowToast={showToast} />
          )}

          {currentPath === '/settings' && (
            <SettingsPage
              tasks={tasks}
              onResetTasks={handleConfirmReset}
              onClearAllTasks={handleClearAllTasks}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Task Create / Edit Modal */}
      {isFormOpen && (
        <TaskForm
          key={taskToEdit ? taskToEdit.id : `create-${initialTaskStatus}-${initialTaskDate || 'none'}`}
          isOpen={isFormOpen}
          taskToEdit={
            taskToEdit || (initialTaskStatus || initialTaskDate ? { status: initialTaskStatus, dueDate: initialTaskDate } : null)
          }
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
            setInitialTaskDate(null);
          }}
        />
      )}

      {/* Task Details Modal */}
      <TaskDetails
        isOpen={Boolean(taskToView)}
        task={taskToView}
        onClose={() => setTaskToView(null)}
        onEdit={(task) => {
          setTaskToView(null);
          handleOpenEditModal(task);
        }}
        onDelete={(task) => {
          setTaskToView(null);
          setTaskToDelete(task);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task from your workspace?"
        taskTitle={taskToDelete?.title || ''}
        confirmLabel="Delete Task"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Sample Workplace Tasks"
        message="This will overwrite your tasks with default workplace demo fixtures. Continue?"
        confirmLabel="Reset to Sample Data"
        cancelLabel="Cancel"
        isDestructive={false}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Export Data Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tasks={tasks}
        onShowToast={showToast}
      />
    </div>
  );
}

/**
 * Top-Level App with all providers configured.
 */
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider>
          <NotificationProvider>
            <WorkspaceShell />
          </NotificationProvider>
        </RouterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
