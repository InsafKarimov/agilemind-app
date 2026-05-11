import React, { useState } from 'react';

const QUIZ_QUESTIONS = [
  { text: 'Что такое WIP-лимит?', options: ['Максимум задач в работе', 'Время спринта', 'Количество сотрудников'], correct: 0 },
  { text: 'Как контекстные подсказки помогают бороться с «Agile-театром»?', options: ['Увеличивают число встреч', 'Объясняют последствия действий', 'Отключают стендапы'], correct: 1 },
  { text: 'Что из перечисленного является признаком «Agile-театра»?', options: ['Обсуждение реальных проблем', 'Формальные ретроспективы без изменений', 'Гибкое планирование'], correct: 1 },
  { text: 'Почему гибридный подход Scrumban эффективнее?', options: ['Убирает все встречи', 'Сочетает спринты с WIP', 'Увеличивает документацию'], correct: 1 }
];

export default function QuizModal({ onClose, onSuccess }) {
  const [answers, setAnswers] = useState({});

  const submitQuiz = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correct) correct++;
    });
    const passed = correct >= 3;
    if (passed) {
      alert(`✅ Поздравляем! Квиз пройден (${correct}/4)\nПолучен значок "Знаток Agile"!`);
      if (onSuccess) onSuccess();
    } else {
      alert(`❌ Квиз не пройден (${correct}/4). Попробуйте ещё раз.`);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="modal-title">📝 Квиз: Знаток Agile</h2>
          <button onClick={onClose} className="learning-close-btn">✕</button>
        </div>
        
        {QUIZ_QUESTIONS.map((q, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{idx+1}. {q.text}</p>
            {q.options.map((opt, oidx) => (
              <label key={oidx} style={{ display: 'block', marginLeft: '12px', marginBottom: '4px' }}>
                <input type="radio" name={`q${idx}`} value={oidx} onChange={(e) => setAnswers({...answers, [idx]: parseInt(e.target.value)})} style={{ marginRight: '8px' }} />
                {opt}
              </label>
            ))}
          </div>
        ))}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={submitQuiz} className="btn-primary" style={{ flex: 1 }}>Проверить</button>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}