import React, { useState } from 'react';
import { verifyUser, saveUser, userExists, login } from '../utils/localStorage';

export default function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Введите имя');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }
    if (verifyUser(name.trim(), password.trim())) {
      onLogin(name.trim());
    } else {
      setError('Неверное имя или пароль');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Введите имя');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 3) {
      setError('Пароль минимум 3 символа');
      return;
    }
    if (userExists(name.trim())) {
      setError('Пользователь уже существует');
      return;
    }
    saveUser({ name: name.trim(), password: password.trim() });
    onLogin(name.trim());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">🎯 AgileMind</div>
        <div className="login-subtitle">Agile-управление проектами с встроенным обучением</div>

        <div className="login-tabs">
          <button className={`login-tab ${isLogin ? 'login-tab-active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>Вход</button>
          <button className={`login-tab ${!isLogin ? 'login-tab-active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>Регистрация</button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input type="text" placeholder="Имя пользователя" className="login-input" value={name} onChange={(e) => setName(e.target.value)} />

          <div style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} placeholder="Пароль" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: '40px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '40%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>{showPassword ? '🙈' : '👁️'}</button>
          </div>

          {!isLogin && (
            <input type={showPassword ? "text" : "password"} placeholder="Подтвердите пароль" className="login-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
        </form>

        <div className="login-note">📦 Все данные сохраняются в браузере</div>
      </div>
    </div>
  );
}