import React, { useState } from 'react';

export default function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title: title.trim(), priority });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{task ? '✏️ Редактировать' : '➕ Новая задача'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название задачи"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            className="modal-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}