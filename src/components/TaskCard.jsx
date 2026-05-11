import React from 'react';

export default function TaskCard({ task, onDelete, onEdit, isDraggable = true }) {
  const priorityColors = {
    Low: 'border-l-green-500 bg-white',
    Medium: 'border-l-yellow-500 bg-white',
    High: 'border-l-red-500 bg-white'
  };

  return (
    <div
      className={`task-card ${priorityColors[task.priority] || 'border-l-indigo-500'} ${!isDraggable ? 'opacity-70' : ''}`}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (isDraggable) {
          e.dataTransfer.setData('taskId', task.id);
          e.target.style.opacity = '0.5';
        }
      }}
      onDragEnd={(e) => e.target.style.opacity = '1'}
    >
      <div className="task-card-content">
        <span className="task-title" onClick={() => onEdit(task)}>
          {task.title}
        </span>
        <button className="task-delete" onClick={() => onDelete(task.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}