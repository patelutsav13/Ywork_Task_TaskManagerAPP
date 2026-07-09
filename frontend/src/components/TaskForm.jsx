import React, { useState } from 'react';
import { createTask } from '../services/api';

const TaskForm = ({ onTaskCreated, showToast }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const isTitleInvalid = touched && !title.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!title.trim()) {
      showToast('Title is required and cannot be empty.', 'error');
      return;
    }

    if (title.length > 255) {
      showToast('Title must be 255 characters or less.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status: 'pending', // default on creation
      });

      setTitle('');
      setDescription('');
      setTouched(false);
      
      // Notify parent to reload list
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      console.error('Error creating task:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const messages = Object.entries(errorData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
            .join(' | ');
          showToast(messages, 'error');
        } else {
          showToast('Failed to create task. Please check your inputs.', 'error');
        }
      } else {
        showToast('Failed to connect to the server. Is the backend running?', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create a New Task</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="task-title" className="form-label">
              Title <span className="required-indicator">*</span>
            </label>
            <span className={`char-counter ${title.length > 255 ? 'limit-exceeded' : ''}`}>
              {title.length}/255
            </span>
          </div>
          <input
            id="task-title"
            type="text"
            className={`form-control ${isTitleInvalid ? 'invalid' : ''}`}
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTouched(true);
            }}
            disabled={isSubmitting}
            maxLength={255}
            required
            aria-invalid={isTitleInvalid}
            aria-describedby={isTitleInvalid ? "title-error" : undefined}
          />
          {isTitleInvalid && (
            <span className="input-feedback-error" id="title-error">
              ⚠️ Title is required.
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="task-desc" className="form-label">Description (Optional)</label>
          <textarea
            id="task-desc"
            className="form-control"
            placeholder="Add details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit" 
          disabled={isSubmitting || title.length > 255}
          id="task-submit-btn"
        >
          {isSubmitting ? (
            <>
              <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
              Creating...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
