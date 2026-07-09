import React, { useEffect } from 'react';

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className={`toast-item ${toast.type}`} role="alert">
      <span className="toast-icon">{getIcon(toast.type)}</span>
      <span className="toast-message">{toast.message}</span>
      <button 
        type="button" 
        className="toast-close-btn"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onCloseToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={onCloseToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
