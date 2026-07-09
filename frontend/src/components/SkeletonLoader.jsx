import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="task-card skeleton">
      <div className="task-header">
        <div className="skeleton-title" />
        <div className="skeleton-badge" />
      </div>
      <div className="task-description">
        <div className="skeleton-line" style={{ width: '85%' }} />
        <div className="skeleton-line" style={{ width: '60%', marginTop: '0.5rem' }} />
      </div>
      <div className="task-footer">
        <div className="skeleton-text" />
        <div className="skeleton-dropdown" />
      </div>
    </div>
  );
};

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="task-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
