import React, { useState } from 'react';

export default function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [methodology, setMethodology] = useState('Scrumban');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), methodology);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">📁 Создать проект</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название проекта"
            className="modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <select
            className="modal-select"
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
          >
            <option value="Scrum">🏃 Scrum (только спринты)</option>
            <option value="Kanban">📋 Kanban (только WIP)</option>
            <option value="Scrumban">🔄 Scrumban (спринты + WIP) 🌟</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Создать</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}