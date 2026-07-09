import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import ToastContainer from './components/Toast';
import SkeletonLoader from './components/SkeletonLoader';
import { getTasks } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, done: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Reusable toast trigger
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const handleCloseToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tasks and update top-level stats
  const fetchTasksAndStats = useCallback(async (currentFilter) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch filtered tasks to display
      const filteredData = await getTasks(currentFilter);
      setTasks(filteredData);

      // 2. Fetch all tasks to compute absolute statistics counts
      const allData = await getTasks();
      setStats({
        total: allData.length,
        pending: allData.filter((t) => t.status === 'pending').length,
        in_progress: allData.filter((t) => t.status === 'in_progress').length,
        done: allData.filter((t) => t.status === 'done').length,
      });
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check if the backend server is running.');
      showToast('Error connecting to backend server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Trigger fetch on load and whenever status filter changes
  useEffect(() => {
    fetchTasksAndStats(filter);
  }, [filter, fetchTasksAndStats]);

  const handleTaskCreated = () => {
    fetchTasksAndStats(filter);
    showToast('Task created successfully!', 'success');
  };

  const handleTaskUpdated = (message = 'Task status updated!') => {
    fetchTasksAndStats(filter);
    showToast(message, 'success');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-title">
            <svg className="brand-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L11 13L15 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>Task Flow</h1>
          </div>
          <p>Ywork.ai Full-Stack Internship Assignment</p>
        </div>
      </header>

      {/* Dashboard Summary Statistics */}
      <section className="stats-dashboard" aria-label="Tasks overview statistics">
        <div className="stat-card total" id="stat-card-total">
          <span className="stat-card-icon">📋</span>
          <div>
            <div className="stat-card-label">Total Tasks</div>
            <div className="stat-card-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card pending" id="stat-card-pending">
          <span className="stat-card-icon">⏳</span>
          <div>
            <div className="stat-card-label">Pending</div>
            <div className="stat-card-value">{stats.pending}</div>
          </div>
        </div>
        <div className="stat-card in_progress" id="stat-card-inprogress">
          <span className="stat-card-icon">⚡</span>
          <div>
            <div className="stat-card-label">In Progress</div>
            <div className="stat-card-value">{stats.in_progress}</div>
          </div>
        </div>
        <div className="stat-card done" id="stat-card-done">
          <span className="stat-card-icon">✅</span>
          <div>
            <div className="stat-card-label">Completed</div>
            <div className="stat-card-value">{stats.done}</div>
          </div>
        </div>
      </section>

      <main>
        {/* Create Task Form Component */}
        <TaskForm onTaskCreated={handleTaskCreated} showToast={showToast} />

        {/* List Toolbar Section */}
        <div className="toolbar">
          <h2 className="toolbar-title">
            {filter === 'all' 
              ? 'All Tasks' 
              : `${filter.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Tasks`
            }
          </h2>
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Task List Grid & Loading Skeleton Loader */}
        {loading ? (
          <SkeletonLoader count={tasks.length > 0 ? tasks.length : 3} />
        ) : (
          <TaskList
            tasks={tasks}
            error={error}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </main>

      {/* Toast Alert System Container */}
      <ToastContainer toasts={toasts} onCloseToast={handleCloseToast} />
    </div>
  );
}

export default App;
