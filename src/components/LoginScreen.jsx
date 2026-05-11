import React, { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">🎯 agilemind</div>
        <div className="login-subtitle">Управление проектами с обучением</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше имя"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
        <div className="login-note">Данные сохраняются в браузере</div>
      </div>
    </div>
  );
}