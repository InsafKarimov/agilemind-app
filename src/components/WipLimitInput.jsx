import React from 'react';

export default function WipLimitInput({ value, onChange, tasksCount, isOver }) {
  return (
    <div className="wip-control">
      <span className="wip-label">WIP:</span>
      <input
        type="number"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        className="wip-input"
      />
      <span className={`wip-count ${isOver ? 'wip-count-over' : ''}`}>
        ({tasksCount} / {value})
      </span>
    </div>
  );
}