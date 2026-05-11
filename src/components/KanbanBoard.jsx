import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import SprintBlock from './SprintBlock';
import QuizModal from './QuizModal';

export default function KanbanBoard({ project, onBack, onUpdate }) {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [wipLimit, setWipLimit] = useState(project.wipLimit || 2);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const showWip = project.methodology !== 'Scrum';

  useEffect(() => {
    onUpdate({ ...project, tasks, wipLimit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, wipLimit]);

  const todo = tasks.filter(t => t.status === 'todo');
  const inprogress = tasks.filter(t => t.status === 'inprogress');
  const done = tasks.filter(t => t.status === 'done');
  const isWipOver = inprogress.length >= wipLimit;

  // ДОБАВЛЕНИЕ ЗАДАЧИ
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      priority: taskData.priority,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  // РЕДАКТИРОВАНИЕ ЗАДАЧИ
  const saveTask = (taskData) => {
    if (!editingTask) return;
    setTasks(tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, title: taskData.title, priority: taskData.priority }
        : t
    ));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    if (window.confirm('Удалить задачу?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const moveTask = (id, newStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    if (newStatus === 'inprogress' && showWip && inprogress.length >= wipLimit && task.status !== 'inprogress') {
  alert(`⚠️ ИНТЕРАКТИВНОЕ ОБУЧЕНИЕ — WIP-лимит превышен!

📌 Что произошло:
Вы пытаетесь добавить задачу в колонку «В работе», но там уже ${inprogress.length} из ${wipLimit} задач.

📌 Почему это важно:
WIP (Work In Progress) — ограничение на количество незавершённых задач. Превышение лимита приводит к:
• Многозадачности и потере фокуса
• Росту времени выполнения задач
• Накоплению «узких мест» в процессе

📌 Что делать:
1. Завершите одну из текущих задач (переместите в «Готово»)
2. Или верните задачу в «К выполнению»

🧠 Это основа Kanban-методологии. Контекстное обучение помогает избегать «Agile-театра» — формального выполнения ритуалов без понимания последствий.`);
  return;
}
    
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  return (
    <div className="board-container">
      {/* МОДАЛКА ЗАДАЧИ */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? saveTask : addTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {showQuiz && (
        <QuizModal
          onClose={() => setShowQuiz(false)}
          onSuccess={() => onUpdate({ ...project, quizPassed: true })}
        />
      )}

      <div className="board-wrapper">
        <button className="back-link" onClick={onBack}>← К проектам</button>

        <div className="board-header">
          <h1 className="board-title">{project.name}</h1>
          <div>
            <button className="btn-add-task" onClick={() => { setEditingTask(null); setShowTaskModal(true); }}>
              ➕ Задача
            </button>
            <button className="btn-quiz" onClick={() => setShowQuiz(true)}>
              🏅 Квиз
            </button>
          </div>
        </div>

        <SprintBlock project={project} onCompleteSprint={onUpdate} />

        <div className="kanban-board">
          {/* To Do */}
          <div className="kanban-column">
            <div className="column-header column-header-blue">
              <div className="column-header-content">
                <h3 className="column-title">📋 К выполнению</h3>
                <span className="column-count">{todo.length}</span>
              </div>
            </div>
            <div
              className="column-content"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); moveTask(parseInt(e.dataTransfer.getData('taskId')), 'todo'); }}
            >
              {todo.map(t => (
                <div
                  key={t.id}
                  className="task-card"
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('taskId', t.id); e.target.style.opacity = '0.5'; }}
                  onDragEnd={(e) => e.target.style.opacity = '1'}
                >
                  <div className="task-card-content">
                    <span className="task-title" onClick={() => openEditModal(t)}>{t.title}</span>
                    <button className="task-delete" onClick={() => deleteTask(t.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className={`kanban-column ${isWipOver ? 'wip-warning' : ''}`}>
            <div className="column-header column-header-yellow">
              <div className="column-header-content">
                <h3 className="column-title">⚙️ В работе</h3>
                {showWip ? (
                  <div className="wip-control">
                    <span className="wip-label">WIP:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={wipLimit}
                      onChange={(e) => setWipLimit(parseInt(e.target.value) || 1)}
                      className="wip-input"
                    />
                    <span className={`wip-count ${isWipOver ? 'wip-count-over' : ''}`}>
                      ({inprogress.length}/{wipLimit})
                    </span>
                  </div>
                ) : (
                  <span className="column-count">{inprogress.length}</span>
                )}
              </div>
            </div>
            <div
              className="column-content"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); moveTask(parseInt(e.dataTransfer.getData('taskId')), 'inprogress'); }}
            >
              {inprogress.map(t => (
                <div
                  key={t.id}
                  className="task-card task-card-yellow"
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('taskId', t.id); e.target.style.opacity = '0.5'; }}
                  onDragEnd={(e) => e.target.style.opacity = '1'}
                >
                  <div className="task-card-content">
                    <span className="task-title" onClick={() => openEditModal(t)}>{t.title}</span>
                    <button className="task-delete" onClick={() => deleteTask(t.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="kanban-column">
            <div className="column-header column-header-green">
              <div className="column-header-content">
                <h3 className="column-title">✅ Готово</h3>
                <span className="column-count">{done.length}</span>
              </div>
            </div>
            <div
              className="column-content"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); moveTask(parseInt(e.dataTransfer.getData('taskId')), 'done'); }}
            >
              {done.map(t => (
                <div
                  key={t.id}
                  className="task-card task-card-green"
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('taskId', t.id); e.target.style.opacity = '0.5'; }}
                  onDragEnd={(e) => e.target.style.opacity = '1'}
                >
                  <div className="task-card-content">
                    <span className="task-title task-done" onClick={() => openEditModal(t)}>{t.title}</span>
                    <button className="task-delete" onClick={() => deleteTask(t.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showWip && (
          <div className="learning-panel">
            <p className="learning-text">
              💡 <strong>Контекстное обучение:</strong> WIP-лимит = {wipLimit}.
              Попробуй превысить лимит — перетащи лишнюю задачу в колонку «В работе».
            </p>
          </div>
        )}
        {project.quizPassed && (
          <div className="quiz-badge">
            <span>🏅</span>
            <span className="quiz-badge-text">Значок "Знаток Agile" получен!</span>
          </div>
        )}
      </div>
    </div>
  );
}