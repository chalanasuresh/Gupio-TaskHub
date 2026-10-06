import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type || 'info'}`}
            role="alert"
          >
            <div className="toast-icon">
              {isSuccess && <CheckCircle2 size={18} className="text-emerald-500" />}
              {isError && <AlertCircle size={18} className="text-rose-500" />}
              {!isSuccess && !isError && <Info size={18} className="text-blue-500" />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
