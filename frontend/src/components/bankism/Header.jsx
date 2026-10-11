import React from 'react';
import { ShieldCheck, RotateCcw, LogOut } from 'lucide-react';

export default function Header({ user, onReset, onLogout }) {
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
          <ShieldCheck size={20} strokeWidth={2.2} />
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
        <button className="btn-ghost" onClick={onReset} title="Reset simulation">
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
        <button className="btn-text" onClick={onLogout} title="Logout">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
