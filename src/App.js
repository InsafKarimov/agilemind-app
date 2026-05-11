import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState('');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`agilemind_${user.id}`);
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        setProjects([{
          id: Date.now(),
          name: 'Учебный проект',
          tasks: [
            { id: 1, title: 'Изучить Agile', status: 'todo' },
            { id: 2, title: 'Настроить доску', status: 'todo' },
            { id: 3, title: 'Пройти квиз', status: 'todo' },
            { id: 4, title: 'WIP лимиты', status: 'inprogress' }
          ],
          wipLimit: 2
        }]);
      }
    }
  }, [user]);

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem(`agilemind_${user.id}`, JSON.stringify(newProjects));
  };

  const handleLogin = () => {
    if (loginName.trim()) setUser({ id: Date.now(), name: loginName.trim() });
  };

  const createProject = () => {
    const name = prompt('Название проекта:');
    if (name) {
      saveProjects([...projects, {
        id: Date.now(),
        name,
        tasks: [],
        wipLimit: 2
      }]);
    }
  };

  const deleteProject = (id) => {
    if (window.confirm('Удалить проект?')) {
      saveProjects(projects.filter(p => p.id !== id));
      if (currentProject?.id === id) setCurrentProject(null);
    }
  };

  const addTask = (title) => {
    if (!title.trim()) return;
    const newTask = { id: Date.now(), title: title.trim(), status: 'todo' };
    const updated = { ...currentProject, tasks: [...currentProject.tasks, newTask] };
    saveProjects(projects.map(p => p.id === currentProject.id ? updated : p));
    setCurrentProject(updated);
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Удалить задачу?')) {
      const updated = { ...currentProject, tasks: currentProject.tasks.filter(t => t.id !== taskId) };
      saveProjects(projects.map(p => p.id === currentProject.id ? updated : p));
      setCurrentProject(updated);
    }
  };

  const moveTask = (taskId, newStatus) => {
    const task = currentProject.tasks.find(t => t.id === taskId);
    const inProgressCount = currentProject.tasks.filter(t => t.status === 'inprogress').length;
    
    if (newStatus === 'inprogress' && inProgressCount >= currentProject.wipLimit) {
      alert(`⚠️ ИНТЕРАКТИВНОЕ ОБУЧЕНИЕ\n\nНельзя добавить задачу в "В работе": лимит ${currentProject.wipLimit} задач.\n\nWIP-лимит — основа Kanban. Превышение ведёт к накоплению задач, росту времени выполнения и потере фокуса.\n\nЗавершите текущие задачи перед добавлением новых.`);
      return;
    }
    
    task.status = newStatus;
    const updated = { ...currentProject, tasks: [...currentProject.tasks] };
    saveProjects(projects.map(p => p.id === currentProject.id ? updated : p));
    setCurrentProject(updated);
  };

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  
  const quizQuestions = [
    { text: 'Что такое WIP-лимит?', options: ['Максимум задач в работе', 'Время спринта'], correct: 0 },
    { text: 'Что будет при превышении WIP?', options: ['Ускорение', 'Накопление задач'], correct: 1 }
  ];
  
  const submitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((q, i) => {
      if (parseInt(quizAnswers[i]) === q.correct) correct++;
    });
    alert(correct === 2 ? '✅ Квиз пройден! Значок получен.' : '❌ Ошибки. Перечитайте про WIP-лимиты.');
    setShowQuiz(false);
    setQuizAnswers({});
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '380px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎯</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>AgileMind</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>Управление проектами с обучением</p>
          <input
            type="text"
            placeholder="Ваше имя"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '16px', fontSize: '16px' }}
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Войти</button>
          <p style={{ fontSize: '11px', color: '#aaa', marginTop: '20px' }}>Демо-версия. Данные в браузере.</p>
        </div>
      </div>
    );
  }

  if (currentProject) {
    const todoTasks = currentProject.tasks.filter(t => t.status === 'todo');
    const inprogressTasks = currentProject.tasks.filter(t => t.status === 'inprogress');
    const doneTasks = currentProject.tasks.filter(t => t.status === 'done');
    const isWipOver = inprogressTasks.length >= currentProject.wipLimit;

    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px' }}>
        {showQuiz && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '380px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>📝 Квиз</h2>
              {quizQuestions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{idx+1}. {q.text}</p>
                  {q.options.map((opt, oidx) => (
                    <label key={oidx} style={{ display: 'block', marginLeft: '12px', marginBottom: '4px' }}>
                      <input type="radio" name={`q${idx}`} value={oidx} onChange={(e) => setQuizAnswers({...quizAnswers, [idx]: e.target.value})} style={{ marginRight: '8px' }} /> {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button onClick={submitQuiz} style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Проверить</button>
              <button onClick={() => setShowQuiz(false)} style={{ width: '100%', padding: '10px', marginTop: '8px', background: '#eee', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Закрыть</button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => setCurrentProject(null)} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>← К проектам</button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{currentProject.name}</h1>
            <div>
              <button onClick={() => { const t = prompt('Название задачи:'); if(t) addTask(t); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}>➕ Задача</button>
              <button onClick={() => setShowQuiz(true)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🏆 Квиз</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
            <div style={{ flex: 1, minWidth: '280px', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #e0e7ff' }}>
                <h3 style={{ fontWeight: 'bold' }}>📋 К выполнению</h3>
                <span style={{ background: '#e0e7ff', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>{todoTasks.length}</span>
              </div>
              <div style={{ minHeight: '400px' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const id = parseInt(e.dataTransfer.getData('id')); moveTask(id, 'todo'); }}>
                {todoTasks.map(task => (
                  <div key={task.id} draggable onDragStart={(e) => { e.dataTransfer.setData('id', task.id); }} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'grab', borderLeft: '4px solid #667eea' }}>
                    <div style={{ fontWeight: '500' }}>{task.title}</div>
                    <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #fef3c7' }}>
                <h3 style={{ fontWeight: 'bold' }}>⚙️ В работе</h3>
                <span style={{ background: isWipOver ? '#fee2e2' : '#fef3c7', color: isWipOver ? '#dc2626' : '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{inprogressTasks.length} / {currentProject.wipLimit}</span>
              </div>
              <div style={{ minHeight: '400px' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const id = parseInt(e.dataTransfer.getData('id')); moveTask(id, 'inprogress'); }}>
                {inprogressTasks.map(task => (
                  <div key={task.id} draggable onDragStart={(e) => { e.dataTransfer.setData('id', task.id); }} style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'grab', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ fontWeight: '500' }}>{task.title}</div>
                    <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #d1fae5' }}>
                <h3 style={{ fontWeight: 'bold' }}>✅ Готово</h3>
                <span style={{ background: '#d1fae5', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>{doneTasks.length}</span>
              </div>
              <div style={{ minHeight: '400px' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const id = parseInt(e.dataTransfer.getData('id')); moveTask(id, 'done'); }}>
                {doneTasks.map(task => (
                  <div key={task.id} style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', marginBottom: '8px', opacity: 0.7, borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontWeight: '500', textDecoration: 'line-through' }}>{task.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <div>
                <p style={{ fontWeight: 'bold', color: '#92400e' }}>Интерактивное обучение</p>
                <p style={{ fontSize: '14px', color: '#78350f' }}>WIP-лимит = {currentProject.wipLimit}. <strong>Перетащи третью задачу в колонку «В работе»</strong> — появится подсказка. Это главная инновация диплома.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>📊 Мои проекты</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>👤 {user.name}</span>
            <button onClick={() => setUser(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Выйти</button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', background: 'white', padding: '60px', borderRadius: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <p style={{ color: '#666', marginBottom: '20px' }}>Создай первый проект</p>
            <button onClick={createProject} style={{ background: '#667eea', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>+ Создать проект</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>📋 {p.tasks.length} задач</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setCurrentProject(p)} style={{ flex: 1, background: '#667eea', color: 'white', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>Открыть</button>
                  <button onClick={() => deleteProject(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
            <button onClick={createProject} style={{ background: 'white', border: '2px dashed #cbd5e1', borderRadius: '20px', padding: '20px', cursor: 'pointer', fontSize: '48px', color: '#94a3b8' }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;