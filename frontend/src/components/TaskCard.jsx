import React, { useState } from 'react';
import { updateTaskStatus } from '../services/api';

const TaskCard = ({ task, onTaskUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);

    // Convert internal status to human readable status for notification
    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return 'Pending';
        case 'in_progress': return 'In Progress';
        case 'done': return 'Completed';
        default: return status;
      }
    };

    try {
      await updateTaskStatus(task.id, newStatus);
      
      // Pass a dynamic, customized message to the parent toast system
      if (onTaskUpdated) {
        onTaskUpdated(`"${task.title}" is now ${getStatusText(newStatus)}.`);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      // Even if update fails, we reload to keep UI consistent and show error
      if (onTaskUpdated) {
        onTaskUpdated('Failed to update task status.', 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  return (
    <div 
      className={`task-card ${task.status}`} 
      id={`task-card-${task.id}`}
      tabIndex="0" /* Enable keyboard focusing of task card */
    >
      {isUpdating && (
        <div className="card-loading-overlay" aria-busy="true">
          <div className="spinner" />
        </div>
      )}

      <div className="task-card-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`status-badge ${task.status}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>

        <p className={`task-description ${!task.description ? 'empty' : ''}`}>
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div className="task-footer">
        <div className="task-date">
          Created: {formatDate(task.created_at)}
        </div>

        <div className="status-control-container">
          <label htmlFor={`status-select-${task.id}`} className="status-label">
            Status
          </label>
          <select
            id={`status-select-${task.id}`}
            className="status-dropdown"
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            aria-label={`Change status for ${task.title}`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
