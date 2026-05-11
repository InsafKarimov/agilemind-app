import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../utils/constants';

export default function QuizModal({ onClose, onSuccess }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const submitQuiz = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    if (correct >= 3 && onSuccess) onSuccess();
  };

  if (submitted) {
    const passed = score >= 3;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="empty-emoji">{passed ? '🏅' : '📚'}</div>
          <h2 className="modal-title">{passed ? 'Поздравляем!' : 'Попробуйте ещё раз'}</h2>
          <p className="empty-text">Правильных ответов: {score} из {QUIZ_QUESTIONS.length}</p>
          {passed && <p className="quiz-badge-text">Вы получили значок "Знаток Agile"! 🎉</p>}
          <button className="btn-primary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '450px', maxWidth: '90vw' }}>
        <h2 className="modal-title">📝 Квиз: Знаток Agile</h2>
        {QUIZ_QUESTIONS.map((q, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{idx+1}. {q.text}</p>
            {q.options.map((opt, oidx) => (
              <label key={oidx} style={{ display: 'block', marginLeft: '12px', marginBottom: '4px' }}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={oidx}
                  onChange={(e) => setAnswers({...answers, [idx]: parseInt(e.target.value)})}
                  style={{ marginRight: '8px' }}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        <div className="modal-buttons">
          <button className="btn-primary" onClick={submitQuiz}>Проверить</button>
          <button className="btn-secondary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}