import React from 'react';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-container">
      <label htmlFor="status-filter" className="filter-label">
        Filter by:
      </label>
      <select
        id="status-filter"
        className="filter-select"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Completed</option>
      </select>
    </div>
  );
};

export default TaskFilter;
