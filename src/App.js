import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState('');

  const handleLogin = () => {
    if (loginName.trim()) {
      setUser({ id: Date.now(), name: loginName.trim() });
    }
  };

  // ЭКРАН ВХОДА
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
          <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">AgileMind</h1>
          <p className="text-gray-500 text-center mb-6">Управление проектами по Agile с обучением</p>
          
          <input
            type="text"
            placeholder="Введите ваше имя"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Войти
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Данные сохраняются в браузере
          </p>
        </div>
      </div>
    );
  }

  // ВРЕМЕННЫЙ ЭКРАН ПОСЛЕ ВХОДА
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Добро пожаловать, {user.name}!</h2>
        <p className="text-gray-500 mb-4">Экран проектов будет здесь</p>
        <button 
          onClick={() => setUser(null)} 
          className="text-red-500 hover:text-red-700"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}

export default App;