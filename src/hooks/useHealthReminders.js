import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  loadHealthRemindersFromStorage,
  saveHealthRemindersToStorage,
  SAMPLE_HEALTH_REMINDERS,
} from '../utils/storage';

export function useHealthReminders(userId) {
  const effectiveUserId = userId || 'user-demo-1';

  const [reminders, setReminders] = useState(() => {
    return loadHealthRemindersFromStorage(effectiveUserId);
  });

  // Reload when active user changes
  useEffect(() => {
    setReminders(loadHealthRemindersFromStorage(effectiveUserId));
  }, [effectiveUserId]);

  // Persist whenever reminders change
  const persistReminders = useCallback(
    (newReminders) => {
      setReminders(newReminders);
      saveHealthRemindersToStorage(effectiveUserId, newReminders);
    },
    [effectiveUserId]
  );

  const createReminder = useCallback(
    ({ name, description = '', time, date, frequency = 'Daily', category = 'General Wellness' }) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newReminder = {
        id: `health-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: effectiveUserId,
        name: name.trim(),
        description: description.trim(),
        time: time || '08:00 AM',
        date: date || todayStr,
        frequency: frequency || 'Daily',
        category: category || 'General Wellness',
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [newReminder, ...reminders];
      persistReminders(updated);
      return { success: true, reminder: newReminder };
    },
    [effectiveUserId, reminders, persistReminders]
  );

  const updateReminder = useCallback(
    (id, updatedFields) => {
      const updated = reminders.map((r) =>
        r.id === id ? { ...r, ...updatedFields, updatedAt: new Date().toISOString() } : r
      );
      persistReminders(updated);
      return { success: true };
    },
    [reminders, persistReminders]
  );

  const deleteReminder = useCallback(
    (id) => {
      const updated = reminders.filter((r) => r.id !== id);
      persistReminders(updated);
      return { success: true };
    },
    [reminders, persistReminders]
  );

  const toggleReminder = useCallback(
    (id) => {
      const updated = reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed, updatedAt: new Date().toISOString() } : r
      );
      persistReminders(updated);
      const found = updated.find((r) => r.id === id);
      return { success: true, completed: found ? found.completed : false };
    },
    [reminders, persistReminders]
  );

  const resetSampleReminders = useCallback(() => {
    persistReminders(SAMPLE_HEALTH_REMINDERS);
  }, [persistReminders]);

  // Derived calculations
  const stats = useMemo(() => {
    const total = reminders.length;
    const completed = reminders.filter((r) => r.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [reminders]);

  // Next upcoming reminder (uncompleted)
  const nextReminder = useMemo(() => {
    const pendingList = reminders.filter((r) => !r.completed);
    if (pendingList.length === 0) return null;
    return pendingList[0];
  }, [reminders]);

  return {
    reminders,
    stats,
    nextReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    resetSampleReminders,
  };
}
