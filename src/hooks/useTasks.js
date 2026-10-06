import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetStorageWithSampleTasks,
} from '../utils/storage';
import {
  calculateTaskStatistics,
  validateTask,
} from '../utils/taskUtils';

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());

  // Keep localStorage synchronized whenever tasks state updates
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  /**
   * Create a new task.
   * Returns { success: boolean, task?: object, errors?: object }
   */
  const createTask = useCallback((taskData) => {
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const now = new Date().toISOString();
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return { success: true, task: newTask };
  }, []);

  /**
   * Update an existing task by ID.
   * Returns { success: boolean, task?: object, errors?: object }
   */
  const updateTask = useCallback((id, updatedData) => {
    const validation = validateTask(updatedData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    let updatedTaskObj = null;

    setTasks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedTaskObj = {
            ...item,
            title: updatedData.title.trim(),
            description: (updatedData.description || '').trim(),
            status: updatedData.status,
            priority: updatedData.priority,
            dueDate: updatedData.dueDate,
            updatedAt: new Date().toISOString(),
          };
          return updatedTaskObj;
        }
        return item;
      })
    );

    if (!updatedTaskObj) {
      return { success: false, errors: { general: 'Task not found.' } };
    }

    return { success: true, task: updatedTaskObj };
  }, []);

  /**
   * Delete a task by ID.
   */
  const deleteTask = useCallback((id) => {
    let deleted = false;
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === id);
      if (exists) {
        deleted = true;
        return prev.filter((t) => t.id !== id);
      }
      return prev;
    });
    return { success: deleted };
  }, []);

  /**
   * Quick status changer (e.g. from card quick dropdown or checkbox).
   */
  const updateTaskStatus = useCallback((id, newStatus) => {
    const validStatuses = ['Todo', 'In Progress', 'Completed'];
    if (!validStatuses.includes(newStatus)) return false;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    return true;
  }, []);

  /**
   * Reset tasks to default sample set.
   */
  const resetTasks = useCallback(() => {
    const fresh = resetStorageWithSampleTasks();
    setTasks(fresh);
    return fresh;
  }, []);

  /**
   * Dynamically derived statistics.
   */
  const stats = useMemo(() => calculateTaskStatistics(tasks), [tasks]);

  return {
    tasks,
    stats,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetTasks,
  };
}
