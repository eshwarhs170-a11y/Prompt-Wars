import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crosshair,
  ScrollText,
  Landmark,
  ShieldCheck,
  Cpu,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { bankingApi } from '../services/api';
import Header from './bankism/Header';
import StatCard from './bankism/StatCard';
import IngestionPanel from './bankism/IngestionPanel';
import VerdictPanel from './bankism/VerdictPanel';

// Lazy load secondary tabs so the Simulator loads instantly and initial bundle is lightweight
const AuditTable = React.lazy(() => import('./bankism/AuditTable'));
const LedgerView = React.lazy(() => import('./bankism/LedgerView'));
const RulesView = React.lazy(() => import('./bankism/RulesView'));
const PromptFlowView = React.lazy(() => import('./bankism/PromptFlowView'));
const OverviewAnalytics = React.lazy(() => import('./bankism/OverviewAnalytics'));
const BenchmarkArena = React.lazy(() => import('./bankism/BenchmarkArena'));
import { BarChart3, Scale } from 'lucide-react';
import { playThreatAlertSound, playSuccessChime } from '../utils/soundEffects';

const TABS = [
  { id: 'overview', label: 'SOC Overview', icon: BarChart3 },
  { id: 'firewall', label: 'Simulator', icon: Crosshair },
  { id: 'flow', label: 'Prompt Flow', icon: Cpu },
  { id: 'audit', label: 'Sentinel Audit Log', icon: ScrollText, count: true },
  { id: 'ledger', label: 'Execution Ledger', icon: Landmark },
  { id: 'rules', label: 'Security Rules L1–L7', icon: ShieldCheck },
  { id: 'benchmark', label: 'Defense Benchmark', icon: Scale },
];

export default function BankismDashboard({ user, onLogout, theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('firewall');
  const [prompt, setPrompt] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [actionType, setActionType] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [lastVerdict, setLastVerdict] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [bankState, setBankState] = useState({
    account: {
      balance: 24850.75,
      accountNumber: 'US-8849-0021-9923',
      accountHolder: 'Alex Mercer',
      currency: 'USD',
      tier: 'Verified Premier'
    },
    recentTransactions: [],
    auditLogs: [],
    metrics: {
      totalRequestsScanned: 0,
      threatsBlocked: 0,
      approvedTransactions: 0,
    },
  });

  const loadState = async () => {
    try {
      const data = await bankingApi.getState();
      setBankState(data);
    } catch (err) {
      console.error('Failed to load banking state:', err);
    }
  };

  React.useEffect(() => {
    loadState();
    // Only refresh in background if the tab is visible to conserve CPU/network
    const id = setInterval(() => {
      if (!document.hidden) {
        loadState();
      }
    }, 8000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        loadState();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const handleIntercept = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setExecutionResult(null);
    try {
      const res = await bankingApi.intercept({
        prompt,
        amount: amount ? Number(amount) : undefined,
        recipient,
        memo,
        actionType: amount ? 'transfer' : actionType,
      });
      setLastVerdict(res.verdict);
      setExecutionResult(res.executionResult);
      if (res.account) {
        setBankState((prev) => ({ ...prev, account: res.account }));
      }
      // High-impact cyber audio feedback
      if (res.verdict) {
        if (!res.verdict.approved || res.verdict.threatCategory !== 'NONE' || res.verdict.riskLevel !== 'SAFE') {
          playThreatAlertSound();
        } else {
          playSuccessChime();
        }
      }
      loadState();
    } catch (err) {
      console.error('Error intercepting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setPrompt(preset.prompt);
    setAmount(preset.amount || '');
    setRecipient(preset.recipient || '');
    setMemo(preset.memo || '');
    setActionType(preset.amount ? 'transfer' : 'chat');
  };

  const handleReset = async () => {
    if (!window.confirm('Reset banking balance and simulation history?')) return;
    await bankingApi.resetState();
    setLastVerdict(null);
    setExecutionResult(null);
    loadState();
  };

  const handleUserLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // Navigate cleanly back to the landing page
    navigate('/');
  };

  const handleClear = () => {
    setPrompt('');
    setAmount('');
    setRecipient('');
    setMemo('');
    setActionType('chat');
  };

  const serverNormalized = lastVerdict?.normalizedInput;
  const clientNormalized = prompt.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const normalizedPreview = serverNormalized || clientNormalized;

  const balance = bankState.account?.balance ?? 0;
  const blocked = bankState.metrics?.threatsBlocked ?? 0;
  const approved = bankState.metrics?.approvedTransactions ?? 0;

  return (
    <div className="app-shell">
      <Header 
        user={user} 
        onReset={handleReset} 
        onLogout={handleUserLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Left Navigation Sidebar with Close Cross Button */}
        {sidebarOpen ? (
          <aside className="dashboard-sidebar">
            <div>
              <div className="sidebar-brand-section">
                <div className="sidebar-header-row">
                  <div className="sidebar-title">Defense Matrix</div>
                  <button 
                    type="button"
                    className="sidebar-close-btn"
                    onClick={() => setSidebarOpen(false)}
                    title="Close sidebar for full view"
                    aria-label="Close sidebar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <nav className="sidebar-nav" role="tablist">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveTab(t.id)}
                    >
                      <div className="sidebar-nav-left">
                        <Icon size={16} />
                        <span>{t.label}</span>
                      </div>
                      {t.count && (
                        <span className="sidebar-count-badge">
                          {bankState.auditLogs?.length || 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="sidebar-footer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--approved)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Perimeter Active</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>L1–L7 Hybrid Defensive Gate</div>
            </div>
          </aside>
        ) : (
          <button 
            type="button" 
            className="sidebar-reopen-floating-btn" 
            onClick={() => setSidebarOpen(true)}
            title="Open Sidebar Navigation"
          >
            <Menu size={18} />
            <span>Modules</span>
          </button>
        )}

        {/* Dedicated Main Content View */}
        <main className={`dashboard-content ${!sidebarOpen ? 'is-full-width' : ''}`}>
          {/* KPI Row with 3D Hover Depth */}
          <div className="stats-grid">
            <StatCard
              label="Core Ledger Balance"
              value={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              context={bankState.account?.accountHolder}
              icon="Landmark"
              tone="accent"
            />
            <StatCard
              label="Attacks Blocked"
              value={blocked}
              context="Threats neutralized"
              icon="Ban"
              tone="blocked"
            />
            <StatCard
              label="Approved Transactions"
              value={approved}
              context="Passed all layers"
              icon="CheckCircle2"
              tone="approved"
            />
            <StatCard
              label="Defense Integrity"
              value="L1–L7 Active"
              context="All layers operational"
              icon="Lock"
              tone="accent"
            />
          </div>

        {/* Tab Content Panels */}
        <div className="tab-panel" key={activeTab}>
          <React.Suspense fallback={
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 600 }}>Loading Security Module...</div>
            </div>
          }>
            {activeTab === 'overview' && (
              <OverviewAnalytics 
                bankState={bankState} 
                onNavigateTab={(tab) => setActiveTab(tab)} 
              />
            )}

            {activeTab === 'firewall' && (
              <div className="arena">
                <IngestionPanel
                  prompt={prompt}
                  setPrompt={setPrompt}
                  amount={amount}
                  setAmount={setAmount}
                  recipient={recipient}
                  setRecipient={setRecipient}
                  memo={memo}
                  setMemo={setMemo}
                  loading={loading}
                  onSubmit={handleIntercept}
                  onPreset={applyPreset}
                  onClear={handleClear}
                  normalizedPreview={normalizedPreview}
                />
                <VerdictPanel
                  verdict={lastVerdict}
                  executionResult={executionResult}
                />
              </div>
            )}

            {activeTab === 'flow' && <PromptFlowView />}

            {activeTab === 'audit' && (
              <AuditTable logs={bankState.auditLogs || []} />
            )}

            {activeTab === 'ledger' && (
              <LedgerView
                account={bankState.account}
                transactions={bankState.recentTransactions || []}
              />
            )}

            {activeTab === 'rules' && <RulesView />}

            {activeTab === 'benchmark' && <BenchmarkArena />}
          </React.Suspense>
        </div>

        {/* Console Footer */}
        <footer className="dashboard-console-footer">
          <div className="dashboard-footer-status">
            <span className="pulse-dot" />
            <span>L1–L7 Firewall Active &bull; Prompt-Wars x UVCE</span>
          </div>
          <button 
            className="dashboard-footer-btn"
            onClick={() => navigate('/')}
          >
            Back to Home &rarr;
          </button>
        </footer>
      </main>
      </div>
    </div>
  );
}
