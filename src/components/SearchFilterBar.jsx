import React from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export default function SearchFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onResetFilters,
  isFiltered,
}) {
  return (
    <div className="filter-bar-container">
      {/* Search Input Row */}
      <div className="filter-primary-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
        <div className="view-mode-toggle" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Card Grid View"
            aria-label="Card Grid View"
          >
            <LayoutGrid size={17} />
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Dense Table View"
            aria-label="Dense Table View"
          >
            <List size={17} />
          </button>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="filter-secondary-row">
        {/* Status Filter Tabs / Select */}
        <div className="filter-group">
          <label htmlFor="filter-status-select" className="filter-label">
            <Filter size={14} /> Status:
          </label>
          <div className="status-tabs-desktop">
            {['All', 'Todo', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                type="button"
                className={`tab-filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => onStatusFilterChange(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Mobile Select */}
          <select
            id="filter-status-select"
            className="filter-select status-select-mobile"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
            <option value="Due Today">Due Today</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label htmlFor="filter-priority-select" className="filter-label">
            Priority:
          </label>
          <select
            id="filter-priority-select"
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="filter-group">
          <label htmlFor="filter-sort-select" className="filter-label">
            <ArrowUpDown size={14} /> Sort By:
          </label>
          <select
            id="filter-sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort tasks"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
        </div>

        {/* Results count & Clear filters button */}
        <div className="filter-actions-right">
          <span className="results-count-text">
            {totalResults} {totalResults === 1 ? 'task' : 'tasks'}
          </span>
          {isFiltered && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
