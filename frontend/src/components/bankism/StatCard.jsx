import React from 'react';
import { Landmark, Ban, CheckCircle2, Lock, Circle } from 'lucide-react';

const ICON_MAP = {
  Landmark,
  Ban,
  CheckCircle2,
  Lock,
  Circle
};

export default function StatCard({ label, value, context, icon, tone = 'accent' }) {
  const Icon = ICON_MAP[icon] || Circle;

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
