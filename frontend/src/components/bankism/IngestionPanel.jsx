import React, { useState, useRef } from 'react';
import {
  ShieldAlert,
  Trash2,
  Sparkles,
  RotateCcw,
  Send,
  Loader2,
  ChevronDown,
  ShieldOff,
  UserX,
  FileText,
  Binary,
  EyeOff,
  KeyRound,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  History,
  CreditCard,
  CheckCircle2,
  Flame,
  Siren
} from 'lucide-react';
import { ATTACK_PRESETS, BENIGN_PRESETS } from './constants';

const ICON_MAP = {
  ShieldOff: ShieldOff,
  Drama: UserX,
  FileText: FileText,
  Binary: Binary,
  EyeOff: EyeOff,
  KeyRound: KeyRound,
  TrendingUp: TrendingUp,
  Wallet: Wallet,
  Send: ArrowUpRight,
  History: History,
  CreditCard: CreditCard,
};

export default function IngestionPanel({
  prompt,
  setPrompt,
  amount,
  setAmount,
  recipient,
  setRecipient,
  memo,
  setMemo,
  loading,
  onSubmit,
  onPreset,
  onClear,
  normalizedPreview,
}) {
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRedTeaming, setIsRedTeaming] = useState(false);
  const [redTeamStep, setRedTeamStep] = useState(0);
  const [redTeamLog, setRedTeamLog] = useState([]);
  const redTeamRef = useRef(false);

  const RED_TEAM_ATTACKS = [
    { label: 'DAN Jailbreak',      preset: ATTACK_PRESETS.find(p => p.id === 'dan') || ATTACK_PRESETS[1] },
    { label: 'Base64 Obfuscation', preset: ATTACK_PRESETS.find(p => p.id === 'base64') || ATTACK_PRESETS[0] },
    { label: 'Zero-Width Stealth', preset: ATTACK_PRESETS.find(p => p.id === 'zwsp') || ATTACK_PRESETS[3] },
    { label: '$50k Limit Bypass',  preset: ATTACK_PRESETS.find(p => p.id === 'limit') || ATTACK_PRESETS[4] },
    { label: 'System Prompt Leak', preset: ATTACK_PRESETS.find(p => p.id === 'sysleak') || ATTACK_PRESETS[2] },
  ];

  const handleLaunchRedTeam = async () => {
    if (isRedTeaming) return;
    setIsRedTeaming(true);
    setRedTeamStep(0);
    setRedTeamLog([]);
    redTeamRef.current = true;

    for (let i = 0; i < RED_TEAM_ATTACKS.length; i++) {
      if (!redTeamRef.current) break;
      const attack = RED_TEAM_ATTACKS[i];
      setRedTeamStep(i + 1);
      onPreset(attack.preset);
      setSelectedPresetId(attack.preset.id || '');
      await new Promise(res => setTimeout(res, 900));
      // Auto-submit
      const syntheticEvent = { preventDefault: () => {} };
      await onSubmit(syntheticEvent);
      setRedTeamLog(prev => [...prev, { label: attack.label, done: true }]);
      await new Promise(res => setTimeout(res, 1400));
    }
    redTeamRef.current = false;
    setIsRedTeaming(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleSelectPreset = (p) => {
    setSelectedPresetId(p.id);
    setIsDropdownOpen(false);
    onPreset(p);
  };

  const selectedPreset = [...ATTACK_PRESETS, ...BENIGN_PRESETS].find(p => p.id === selectedPresetId);

  // 4 high-value quick presets with distinct Lucide icons
  const quickPicks = [
    { ...ATTACK_PRESETS[1], badge: 'DAN Jailbreak', color: '#f43f5e', LucideIcon: UserX },
    { ...ATTACK_PRESETS[0], badge: 'Policy Override', color: '#f43f5e', LucideIcon: ShieldOff },
    { ...ATTACK_PRESETS[2], badge: 'Memo Smuggling', color: '#f59e0b', LucideIcon: FileText },
    { ...BENIGN_PRESETS[1], badge: 'Safe $120 Wire', color: '#10b981', LucideIcon: ArrowUpRight },
  ];

  return (
    <section className="card ingestion">
      {/* Header with Title and Clear Form */}
      <header className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="card-title">
          <ShieldAlert size={18} color="var(--accent)" />
          <h2>Untrusted Request Ingestion</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {(prompt || amount || recipient || memo) && (
            <button
              type="button"
              onClick={() => { onClear(); setSelectedPresetId(''); }}
              className="btn-ghost sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--blocked)',
                borderColor: 'rgba(244, 63, 94, 0.25)',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 600
              }}
              title="Clear all inputs"
            >
              <Trash2 size={13} />
              <span>Clear Form</span>
            </button>
          )}
          <span className="card-meta">Raw ingress</span>
        </div>
      </header>

      <div className="card-body">
        {/* Input Form */}
        <form onSubmit={onSubmit} className="intake-form">
          <div className="field">
            <div className="field-label">
              <span>Natural language request</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="char-count">{prompt.length} chars</span>
                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
            <textarea
              id="prompt"
              className="input mono"
              rows={4}
              placeholder="Type a natural language command or select a preset below..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="amount" className="field-label">
                <span>Amount (USD)</span>
              </label>
              <input
                id="amount"
                type="number"
                className="input mono"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="recipient" className="field-label">
                <span>Recipient</span>
              </label>
              <input
                id="recipient"
                type="text"
                className="input"
                placeholder="alice@pay.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="memo" className="field-label">
              <span>Payment Memo</span>
              <span className="field-hint">Scanned by Layer 6 Deep Memo Guard</span>
            </label>
            <input
              id="memo"
              type="text"
              className="input"
              placeholder="Dinner reimbursement"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <div className="normalized">
            <span className="normalized-label">Normalized preview</span>
            <code className="normalized-body">
              {normalizedPreview || <em style={{ color: 'var(--text-muted)' }}>Awaiting input</em>}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Analyzing Through L1–L7 Pipeline...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Execute & Analyze Request</span>
                </>
              )}
            </button>

            {(prompt || amount || recipient || memo) && (
              <button
                type="button"
                onClick={() => { onClear(); setSelectedPresetId(''); }}
                className="btn-ghost"
                style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Clear all fields"
              >
                <RotateCcw size={15} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </form>

        {/* ── Autonomous Red-Team Firing Range ── */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '12px',
          background: isRedTeaming
            ? 'rgba(244, 63, 94, 0.08)'
            : 'rgba(99, 102, 241, 0.06)',
          border: `1px solid ${isRedTeaming ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.25)'}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: redTeamLog.length > 0 || isRedTeaming ? '14px' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Flame size={16} color={isRedTeaming ? 'var(--blocked)' : 'var(--accent)'} />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: isRedTeaming ? 'var(--blocked)' : 'var(--text-primary)' }}>
                {isRedTeaming ? `Red-Team Firing Range · Attack ${redTeamStep} / ${RED_TEAM_ATTACKS.length}...` : 'Autonomous Red-Team Firing Range'}
              </span>
            </div>
            <button
              type="button"
              className={isRedTeaming ? 'btn-ghost' : 'btn-primary'}
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                ...(isRedTeaming ? { color: 'var(--blocked)', borderColor: 'rgba(244,63,94,0.3)' } : {})
              }}
              onClick={isRedTeaming
                ? () => { redTeamRef.current = false; setIsRedTeaming(false); setRedTeamLog([]); setRedTeamStep(0); }
                : handleLaunchRedTeam
              }
              disabled={loading}
            >
              {isRedTeaming ? (
                <><Loader2 size={13} className="spin" /><span>Abort Simulation</span></>
              ) : (
                <><Siren size={13} /><span>▶ Launch 5-Attack Salvo</span></>
              )}
            </button>
          </div>

          {/* Live attack progress log */}
          {(redTeamLog.length > 0 || isRedTeaming) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {RED_TEAM_ATTACKS.map((a, i) => {
                const completed = redTeamLog.some(r => r.label === a.label);
                const active = isRedTeaming && i + 1 === redTeamStep && !completed;
                return (
                  <div key={a.label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11.5px',
                    opacity: (!active && !completed) ? 0.4 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    {completed ? (
                      <CheckCircle2 size={12} color="var(--blocked)" />
                    ) : active ? (
                      <Loader2 size={12} className="spin" color="var(--accent)" />
                    ) : (
                      <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid var(--border)' }} />
                    )}
                    <span style={{ color: completed ? 'var(--blocked)' : active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {a.label}
                    </span>
                    {completed && (
                      <span style={{ fontSize: '10px', color: 'var(--blocked)', fontWeight: 700 }}>NEUTRALIZED</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clean, Visible Testcase Selector Section with Lucide Icons */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          position: 'relative',
          overflow: 'visible'
        }}>
          {/* Header Row: Label + Custom Lucide Dropdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--accent)" />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Test Scenarios & Presets
              </span>
            </div>

            {/* Custom Styled Dropdown Button */}
            <div style={{ position: 'relative', overflow: 'visible' }}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <span>{selectedPreset ? selectedPreset.label : `All Scenarios (${ATTACK_PRESETS.length + BENIGN_PRESETS.length})`}</span>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Custom Lucide Dropdown Popover (opens downward) */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  width: '300px',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '12px',
                  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(20px)',
                  zIndex: 200,
                  padding: '8px'
                }}>
                  {/* Attack Presets Group */}
                  <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--blocked)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={13} />
                    <span>Adversarial Attacks</span>
                  </div>
                  {ATTACK_PRESETS.map((p) => {
                    const PresetIcon = ICON_MAP[p.icon] || ShieldOff;
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isSelected ? 'var(--blocked-soft)' : 'transparent',
                          color: isSelected ? 'var(--blocked)' : 'var(--text-primary)',
                          fontSize: '12.5px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                      >
                        <PresetIcon size={14} color="var(--blocked)" />
                        <span style={{ fontWeight: isSelected ? 700 : 500 }}>{p.label}</span>
                      </button>
                    );
                  })}

                  {/* Legitimate Presets Group */}
                  <div style={{ padding: '10px 10px 6px', fontSize: '11px', fontWeight: 700, color: 'var(--approved)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border)', marginTop: '6px' }}>
                    <CheckCircle2 size={13} />
                    <span>Legitimate Banking Requests</span>
                  </div>
                  {BENIGN_PRESETS.map((p) => {
                    const PresetIcon = ICON_MAP[p.icon] || ArrowUpRight;
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isSelected ? 'var(--approved-soft)' : 'transparent',
                          color: isSelected ? 'var(--approved)' : 'var(--text-primary)',
                          fontSize: '12.5px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                      >
                        <PresetIcon size={14} color="var(--approved)" />
                        <span style={{ fontWeight: isSelected ? 700 : 500 }}>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick-Pick 1-Click Cards Grid with Lucide Icons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '10px'
          }}>
            {quickPicks.map((p) => {
              const isSelected = selectedPresetId === p.id;
              const CardIcon = p.LucideIcon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  style={{
                    background: isSelected ? 'var(--bg-panel)' : 'var(--bg-input)',
                    border: `1px solid ${isSelected ? p.color : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: isSelected ? `0 0 14px ${p.color}33` : 'none',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      background: `${p.color}20`,
                      color: p.color
                    }}>
                      <CardIcon size={11} color={p.color} />
                      <span>{p.badge}</span>
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>Load &rarr;</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
