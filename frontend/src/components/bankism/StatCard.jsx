import React from 'react';
import * as Icons from 'lucide-react';

export default function StatCard({ label, value, context, icon, tone = 'accent' }) {
  const Icon = Icons[icon] || Icons.Circle;

  return (
    <div className="stat-card">
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className={`stat-value tone-${tone}`}>{value}</span>
        {context && <span className="stat-context">{context}</span>}
      </div>
      <div className={`stat-tile tone-${tone}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  );
}
