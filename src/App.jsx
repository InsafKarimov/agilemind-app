import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { loadCurrentUser, saveUser, loadUserProjects } from './utils/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  // Загрузка при старте
  useEffect(() => {
    const savedUser = loadCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      const savedProjects = loadUserProjects(savedUser.name);
      setProjects(savedProjects);
    }
  }, []);

  const handleLogin = (name) => {
    const newUser = { id: Date.now(), name };
    saveUser(newUser);
    setUser(newUser);
    const savedProjects = loadUserProjects(name);
    setProjects(savedProjects);
  };

  const updateProjects = (newProjects) => {
    setProjects(newProjects);
    if (user) {
      localStorage.setItem(`agilemind_projects_${user.name}`, JSON.stringify(newProjects));
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      user={user}
      projects={projects}
      onUpdateProjects={updateProjects}
    />
  );
}

export default App;