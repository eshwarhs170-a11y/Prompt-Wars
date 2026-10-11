import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BankismDashboard from './components/BankismDashboard';
import './index.css';
import './styles/bankism.css';
import './styles/theme.css';
import './styles/header.css';
import './styles/landing.css';

// Protected Route Guard: If not authenticated, redirect to Login
const ProtectedDashboard = ({ token, user, handleLogout, theme, toggleTheme }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <BankismDashboard 
      user={user} 
      onLogout={handleLogout} 
      theme={theme} 
      toggleTheme={toggleTheme} 
    />
  );
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
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
        {/* 1. Public Landing Page */}
        <Route 
          path="/" 
          element={<LandingPage theme={theme} toggleTheme={toggleTheme} isAuthenticated={!!token} />} 
        />

        {/* 2. Login Page: If already authenticated, redirect straight to /dashboard */}
        <Route 
          path="/login" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
            )
          } 
        />

        {/* 3. Protected Main SOC Dashboard: If not logged in, redirects to /login */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedDashboard 
              token={token} 
              user={user} 
              handleLogout={handleLogout} 
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
