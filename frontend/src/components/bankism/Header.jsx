import React from 'react';
import { ShieldCheck, RotateCcw, LogOut, Sun, Moon } from 'lucide-react';
import '../../styles/header.css';

export default function Header({ user, onReset, onLogout, theme, toggleTheme }) {
  const initials = (user?.username || 'SA')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={20} strokeWidth={2.4} />
        </div>
        <div>
          <div className="brand-name">Bankism</div>
          <div className="brand-sub">AI Defensive Firewall</div>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill">
          <span className="pulse-dot" />
          Protection Active
        </div>

        <div className="limit-chip">Limit $10,000</div>

        <div className="user-chip">
          <span className="avatar">{initials}</span>
          <span className="user-name">{user?.username || 'Security Architect'}</span>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Reset Simulation Button */}
        <button 
          className="header-action-btn" 
          onClick={onReset} 
          title="Reset simulation ledger and logs"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {/* Logout Button */}
        <button 
          className="header-action-btn logout" 
          onClick={onLogout} 
          title="Exit Sentinel Console"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
