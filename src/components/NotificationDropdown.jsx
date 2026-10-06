import React, { useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDropdown({ isOpen, onClose, onViewTask }) {
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const [browserPermission, setBrowserPermission] = React.useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported';
  });

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
      } catch {
        // ignore
      }
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown" ref={dropdownRef} role="dialog" aria-label="Notifications">
      <div className="notif-dropdown-header">
        <div className="notif-header-title">
          <Bell size={16} className="text-primary" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="notif-unread-badge">{unreadCount} new</span>
          )}
        </div>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-text-xs"
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <Check size={13} />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              className="btn-text-xs text-danger"
              onClick={clearNotifications}
              title="Clear all"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
          <button
            type="button"
            className="notif-close-btn"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {browserPermission === 'default' && (
        <div className="notif-permission-banner">
          <div className="notif-perm-text">
            <span className="notif-perm-title">Enable desktop notifications</span>
            <span className="notif-perm-subtitle">Alerts appear while TaskHub is active in your browser</span>
          </div>
          <button
            type="button"
            className="btn-perm-enable"
            onClick={requestBrowserPermission}
          >
            Enable
          </button>
        </div>
      )}

      <div className="notif-dropdown-body">
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <Bell size={32} className="text-muted opacity-40" />
            <p className="notif-empty-title">All caught up!</p>
            <p className="notif-empty-desc">No new notifications or pending alerts.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((item) => {
              const isWarning = item.type === 'warning';
              const isHigh = item.type === 'high';
              const isSuccess = item.type === 'success';

              return (
                <div
                  key={item.id}
                  className={`notif-item ${item.read ? 'is-read' : 'is-unread'}`}
                  onClick={() => {
                    markAsRead(item.id);
                    if (item.taskId && onViewTask) {
                      onViewTask(item.taskId);
                      onClose();
                    }
                  }}
                >
                  <div className="notif-item-icon">
                    {isWarning && <AlertTriangle size={16} className="text-rose-500" />}
                    {isHigh && <Flame size={16} className="text-amber-500" />}
                    {isSuccess && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {!isWarning && !isHigh && !isSuccess && <Info size={16} className="text-blue-500" />}
                  </div>

                  <div className="notif-item-content">
                    <div className="notif-item-title-row">
                      <span className="notif-item-title">{item.title}</span>
                      {!item.read && <span className="notif-unread-dot" />}
                    </div>
                    <p className="notif-item-msg">{item.message}</p>
                    <span className="notif-item-time">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
