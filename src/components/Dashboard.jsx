import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import KanbanBoard from './KanbanBoard';

export default function Dashboard({ user, projects, onUpdateProjects }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const createProject = (name, methodology) => {
    const newProject = {
      id: Date.now(),
      name,
      methodology,
      createdAt: new Date().toLocaleDateString(),
      tasks: [],
      wipLimit: 2,
      activeSprint: null,
      quizPassed: false
    };
    onUpdateProjects([...projects, newProject]);
  };

  const deleteProject = (id) => {
    if (window.confirm('Удалить проект?')) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const updateProject = (updated) => {
    const newProjects = projects.map(p => p.id === updated.id ? updated : p);
    onUpdateProjects(newProjects);
    setCurrentProject(updated);
  };

  // ВЫХОД ИЗ АККАУНТА
  const handleLogout = () => {
    localStorage.removeItem('agilemind_current_user');
    window.location.reload();
  };

  if (currentProject) {
    return (
      <KanbanBoard
        project={currentProject}
        onBack={() => setCurrentProject(null)}
        onUpdate={updateProject}
      />
    );
  }

  const passedCount = projects.filter(p => p.quizPassed).length;

  return (
    <div className="app-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">📊 AgileMind</h1>
            <p className="dashboard-subtitle">Управление проектами с обучением</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="badge-counter">
              🏅 Знатоков: {passedCount} / {projects.length}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🚪 Выйти
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🚀</div>
            <p className="empty-text">Создайте первый проект</p>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              + Создать проект
            </button>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={setCurrentProject}
                onDelete={deleteProject}
              />
            ))}
            <button className="add-project-btn" onClick={() => setShowCreateModal(true)}>
              +
            </button>
          </div>
        )}

        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createProject}
          />
        )}
      </div>
    </div>
  );
}