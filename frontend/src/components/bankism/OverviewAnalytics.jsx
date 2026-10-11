import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Lock, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Layers, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight
} from 'lucide-react';

export default function OverviewAnalytics({ bankState, onNavigateTab }) {
  const metrics = bankState.metrics || {};
  const total = metrics.totalRequestsScanned || 0;
  const blocked = metrics.threatsBlocked || 0;
  const approved = metrics.approvedTransactions || 0;
  const balance = bankState.account?.balance || 24850.75;
  const logs = bankState.auditLogs || [];

  // Derived percentages
  const safePercent = total > 0 ? Math.round((approved / total) * 100) : 100;
  const blockPercent = total > 0 ? Math.round((blocked / total) * 100) : 0;

  // SVG Circular Gauge calculation
  // Radius = 62, Circumference = 2 * PI * 62 ≈ 389.5
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const safeStrokeOffset = circumference - (circumference * safePercent) / 100;

  // L1-L7 Guardrail Health Matrix
  const layerStats = [
    { id: 'L1', name: 'Unicode & Homoglyph', status: 'Optimal', blocked: logs.filter(l => l.risk === 'CRITICAL' && l.prompt?.includes('u')).length, health: 99.8 },
    { id: 'L2', name: 'Base64 & Hex Decode', status: 'Optimal', blocked: logs.filter(l => l.threat === 'TOKEN_OBFUSCATION').length, health: 99.5 },
    { id: 'L3', name: 'Directive Override', status: 'Active', blocked: logs.filter(l => l.threat === 'POLICY_OVERRIDE').length, health: 98.9 },
    { id: 'L4', name: 'DAN & Jailbreak Roleplay', status: 'Active', blocked: logs.filter(l => l.threat === 'JAILBREAK_ROLEPLAY').length, health: 99.1 },
    { id: 'L5', name: 'Exfiltration Blocker', status: 'Optimal', blocked: logs.filter(l => l.threat === 'DATA_EXFILTRATION').length, health: 100 },
    { id: 'L6', name: 'Deep Memo Scanner', status: 'Active', blocked: logs.filter(l => l.threat === 'MEMO_INJECTION').length, health: 98.4 },
    { id: 'L7', name: 'Deterministic Gateway', status: 'Guaranteed', blocked: logs.filter(l => l.threat === 'AMOUNT_CEILING_EXCEEDED').length, health: 100 },
  ];

  // Threat categories breakdown
  const categoryCounts = [
    { label: 'Policy Override', count: logs.filter(l => l.threat?.includes('POLICY')).length || 0, color: '#f43f5e' },
    { label: 'Jailbreak Roleplay', count: logs.filter(l => l.threat?.includes('JAILBREAK')).length || 0, color: '#fb923c' },
    { label: 'Memo Injection', count: logs.filter(l => l.threat?.includes('MEMO')).length || 0, color: '#eab308' },
    { label: 'Threshold Ceiling', count: logs.filter(l => l.threat?.includes('THRESHOLD') || l.threat?.includes('CEILING')).length || 0, color: '#a855f7' },
    { label: 'Safe Banking Traffic', count: approved, color: '#10b981' },
  ];

  const maxCategory = Math.max(...categoryCounts.map(c => c.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Visual Row: Circular Threat Matrix + Realtime Bar Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Card 1: Circular Visual Score Gauge with Cyber Scan Effect */}
        <div className="card cyber-scan-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="pulse-ring" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--approved)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Firewall Health Index</h3>
            </div>
            <span className="chip mono chip-approved" style={{ fontSize: '11px' }}>
              REALTIME SOC
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            flexWrap: 'wrap',
            padding: '12px 0'
          }}>
            {/* SVG Circle Gauge */}
            <div style={{ position: 'relative', width: '150px', height: '150px', display: 'grid', placeItems: 'center' }}>
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="12"
                />
                {/* Blocked Ring Segment */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * blockPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                {/* Approved Ring Segment */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke="url(#approvedGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={safeStrokeOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <defs>
                  <linearGradient id="approvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Center Text */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {safePercent}%
                </span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>
                  Safety Score
                </span>
              </div>
            </div>

            {/* Circular Stats Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '140px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Passed Transactions</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{approved}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Attacks Neutralized</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#f43f5e' }}>{blocked}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Evaluated</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{total}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Zero-Discretion Banking Mode</span>
            <span style={{ color: 'var(--approved)', fontWeight: 600 }}>Active &bull; 0.4ms avg</span>
          </div>
        </div>

        {/* Card 2: Interactive Threat Vector Breakdown Chart */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Traffic & Attack Vector Distribution</h3>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              LIVE BARS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            {categoryCounts.map((cat, i) => {
              const barWidth = Math.max((cat.count / maxCategory) * 100, 8);
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{cat.count}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: cat.color,
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Dual-Classifier LLM Audits</span>
            <button 
              onClick={() => onNavigateTab('firewall')}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
            >
              Test Vector in Simulator &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Visual Row: L1–L7 Defense Layer Grid */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              L1–L7 Defense Grid & Resilience Matrix
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Live status and telemetry for each autonomous inspection boundary
            </p>
          </div>
          <button 
            className="btn-ghost sm"
            onClick={() => onNavigateTab('rules')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View Full Rule Specs</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {layerStats.map((l) => (
            <div 
              key={l.id} 
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="chip mono chip-accent" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {l.id}
                </span>
                <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  {l.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {l.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span>Reliability: {l.health}%</span>
                <span>Hits: {l.blocked}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
