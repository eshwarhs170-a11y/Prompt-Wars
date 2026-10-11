import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BankismDashboard from './components/BankismDashboard';
import './index.css';
import './styles/bankism.css';
import './styles/landing.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-token');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { username: 'Security Architect', avatar: '🛡️' };
  });

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
        {/* 1. Landing Page - First Page Everyone Sees */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Login Page */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />

        {/* 3. Main SOC Firewall Dashboard */}
        <Route 
          path="/dashboard" 
          element={<BankismDashboard user={user} onLogout={handleLogout} />} 
        />

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
