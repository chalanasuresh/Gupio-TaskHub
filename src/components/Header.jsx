import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';

const TODAY_FORMATTED = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export default function Header({
  pageTitle = 'Dashboard Overview',
  pageSubtitle = 'Manage, track, and organize team productivity tasks.',
  onOpenSidebar,
  onOpenCreateTask,
}) {

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={22} />
        </button>

        <div className="header-titles">
          <h2 className="header-page-title">{pageTitle}</h2>
          <p className="header-page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-date-badge">
          <Calendar size={14} className="text-muted" />
          <span>{TODAY_FORMATTED}</span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-add-task"
          onClick={onOpenCreateTask}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
