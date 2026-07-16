import React, { useState } from 'react';
import Notices from './components/notices';
// import { fetchNotices } from './api';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // In a real application, this would involve authentication
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Campus Pulse</h1>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <Notices />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Campus Pulse</h2>
            <p className="mb-4">Please log in to view notices and interact with the community.</p>
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          &copy; 2023 Campus Pulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;

