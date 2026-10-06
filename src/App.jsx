import React, { useState, useMemo, useCallback } from 'react';
import {
  Layers,
  CircleDot,
  Clock,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';
import { filterAndSortTasks } from './utils/taskUtils';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import SearchFilterBar from './components/SearchFilterBar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

export default function App() {
  const {
    tasks,
    stats,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetTasks,
  } = useTasks();

  const { toasts, showToast, removeToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Navigation state
  const [currentNavView, setCurrentNavView] = useState('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Derive filtered and sorted tasks
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

  // Handle navigation change from sidebar
  const handleNavChange = useCallback((navId, filterValue) => {
    setCurrentNavView(navId);
    if (filterValue !== null) {
      setStatusFilter(filterValue);
    } else {
      setStatusFilter('All');
    }
  }, []);

  // Reset all search and filter controls
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('newest');
  }, []);

  // Form submission (handles both Create and Edit)
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

  // Delete task after confirmation
  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return;
    const taskTitle = taskToDelete.title;
    const result = deleteTask(taskToDelete.id);
    if (result.success) {
      showToast(`Task "${taskTitle}" deleted.`, 'success');
      // If the currently viewed task was deleted, close view modal
      if (taskToView && taskToView.id === taskToDelete.id) {
        setTaskToView(null);
      }
    } else {
      showToast('Could not delete task.', 'error');
    }
    setTaskToDelete(null);
  }, [taskToDelete, deleteTask, taskToView, showToast]);

  // Quick status toggle
  const handleStatusChange = useCallback(
    (id, newStatus) => {
      const ok = updateTaskStatus(id, newStatus);
      if (ok) {
        showToast(`Status updated to "${newStatus}".`, 'info', 2500);
        // If currently viewing, update the local view object
        if (taskToView && taskToView.id === id) {
          setTaskToView((prev) => ({ ...prev, status: newStatus }));
        }
      }
    },
    [updateTaskStatus, taskToView, showToast]
  );

  // Reset to initial sample tasks
  const handleConfirmReset = useCallback(() => {
    resetTasks();
    setIsResetConfirmOpen(false);
    handleResetFilters();
    showToast('Sample tasks restored successfully.', 'success');
  }, [resetTasks, handleResetFilters, showToast]);

  // Open modal helpers
  const handleOpenCreateModal = useCallback(() => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  }, []);

  // Filter click from stat cards
  const handleStatCardClick = useCallback((targetFilter) => {
    if (statusFilter === targetFilter) {
      setStatusFilter('All');
    } else {
      setStatusFilter(targetFilter);
    }
  }, [statusFilter]);

  // Compute page title and subtitle
  const pageTitle = useMemo(() => {
    if (statusFilter === 'Todo') return 'Todo Tasks';
    if (statusFilter === 'In Progress') return 'In Progress Tasks';
    if (statusFilter === 'Completed') return 'Completed Tasks';
    if (statusFilter === 'Overdue') return 'Overdue Tasks';
    if (statusFilter === 'Due Today') return 'Tasks Due Today';
    if (priorityFilter === 'High') return 'High Priority Tasks';
    return 'Task Management Dashboard';
  }, [statusFilter, priorityFilter]);

  return (
    <div className="app-shell">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Dark Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpenMobile}
        onClose={() => setIsSidebarOpenMobile(false)}
        currentView={currentNavView}
        onViewChange={handleNavChange}
        stats={stats}
        onResetDataClick={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div className="app-main-layout">
        <Header
          pageTitle={pageTitle}
          pageSubtitle="Track deadlines, balance priorities, and streamline daily productivity."
          onOpenSidebar={() => setIsSidebarOpenMobile(true)}
          onOpenCreateTask={handleOpenCreateModal}
        />

        <main className="app-content-body">
          {/* Section 1: Dynamic Statistics Cards */}
          <section className="stats-cards-grid" aria-label="Task metrics">
            <StatCard
              label="Total Tasks"
              value={stats.total}
              icon={Layers}
              variant="default"
              subtext="Overall backlog"
              isActive={statusFilter === 'All' && priorityFilter === 'All'}
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
            />
            <StatCard
              label="Todo"
              value={stats.todo}
              icon={CircleDot}
              variant="todo"
              subtext="Pending start"
              isActive={statusFilter === 'Todo'}
              onClick={() => handleStatCardClick('Todo')}
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              icon={Clock}
              variant="progress"
              subtext="Actively worked on"
              isActive={statusFilter === 'In Progress'}
              onClick={() => handleStatCardClick('In Progress')}
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              variant="completed"
              subtext={`${stats.completionRate}% completion rate`}
              isActive={statusFilter === 'Completed'}
              onClick={() => handleStatCardClick('Completed')}
            />
            <StatCard
              label="High Priority"
              value={stats.highPriority}
              icon={Flame}
              variant="high"
              subtext="Urgent focus items"
              isActive={priorityFilter === 'High'}
              onClick={() => {
                setPriorityFilter(priorityFilter === 'High' ? 'All' : 'High');
              }}
            />
          </section>

          {/* Section 2: Search, Filters, Sorting & View Toggle */}
          <section className="controls-section" aria-label="Task controls">
            <SearchFilterBar
              search={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResults={filteredTasks.length}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
            />
          </section>

          {/* Section 3: Task Grid / Table / Empty States */}
          <section className="task-content-section" aria-label="Task listing">
            <TaskList
              tasks={filteredTasks}
              totalOriginalTasks={tasks.length}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              viewMode={viewMode}
              onView={(task) => setTaskToView(task)}
              onEdit={handleOpenEditModal}
              onDelete={(task) => setTaskToDelete(task)}
              onStatusChange={handleStatusChange}
              onCreateTask={handleOpenCreateModal}
              onClearFilters={handleResetFilters}
              onResetTasks={() => setIsResetConfirmOpen(true)}
            />
          </section>
        </main>
      </div>

      {/* Task Create / Edit Modal */}
      {isFormOpen && (
        <TaskForm
          key={taskToEdit ? taskToEdit.id : 'create-new'}
          isOpen={isFormOpen}
          taskToEdit={taskToEdit}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
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

      {/* Reset Sample Tasks Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Sample Workplace Tasks"
        message="This will replace any current tasks with the default 8 realistic workplace sample tasks. Are you sure you want to continue?"
        confirmLabel="Reset to Sample Data"
        cancelLabel="Keep Current Data"
        isDestructive={false}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
