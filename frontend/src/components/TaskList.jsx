import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, loading, error, onTaskUpdated }) => {
  if (loading && tasks.length === 0) {
    return (
      <div className="list-loading">
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} />
        <p>Loading tasks from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ marginTop: '1.5rem' }}>
        <span>⚠️</span> {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state" id="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>No Tasks Found</h3>
        <p>There are no tasks matching your selected filter. Create one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-grid" id="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
};

export default TaskList;
