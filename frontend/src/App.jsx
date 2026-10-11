import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BankismDashboard from './components/BankismDashboard';
import './index.css';
import './styles/bankism.css';
import './styles/theme.css';
import './styles/landing.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-token');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { username: 'Security Architect', avatar: '🛡️' };
  });

  // Global Light / Dark Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('bankism_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bankism_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Landing Page */}
        <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />

        {/* 2. Login Page */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />} 
        />

        {/* 3. Main SOC Firewall Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <BankismDashboard 
              user={user} 
              onLogout={handleLogout} 
              theme={theme} 
              toggleTheme={toggleTheme} 
            />
          } 
        />

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
