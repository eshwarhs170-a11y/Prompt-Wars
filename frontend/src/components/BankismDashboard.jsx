import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ban,
  CheckCircle2,
  Lock,
  Crosshair,
  ScrollText,
  Landmark,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { bankingApi } from '../services/api';
import Header from './bankism/Header';
import StatCard from './bankism/StatCard';
import IngestionPanel from './bankism/IngestionPanel';
import VerdictPanel from './bankism/VerdictPanel';
import AuditTable from './bankism/AuditTable';
import LedgerView from './bankism/LedgerView';
import RulesView from './bankism/RulesView';
import PromptFlowView from './bankism/PromptFlowView';

const TABS = [
  { id: 'firewall', label: 'Simulator', icon: Crosshair },
  { id: 'flow', label: 'Prompt Flow', icon: Cpu },
  { id: 'audit', label: 'Sentinel Audit Log', icon: ScrollText, count: true },
  { id: 'ledger', label: 'Execution Ledger', icon: Landmark },
  { id: 'rules', label: 'Security Rules L1–L7', icon: ShieldCheck },
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
    const id = setInterval(loadState, 6000);
    return () => clearInterval(id);
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

      <main className="container">
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

        {/* Navigation Tabs */}
        <nav className="tabs" role="tablist">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                className={`tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={15} />
                <span>{t.label}</span>
                {t.count && (
                  <span className="tab-count">
                    {bankState.auditLogs?.length || 0}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Panels */}
        <div className="tab-panel" key={activeTab}>
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
        </div>

        {/* Enterprise SOC Console Dock Footer */}
        <footer className="dashboard-console-footer">
          <div className="dashboard-footer-status">
            <span className="pulse-dot" />
            <span>L1–L7 SENTINEL FIREWALL ENGINE: ACTIVE</span>
          </div>

          <div className="dashboard-footer-metrics">
            <span>GATEWAY CEILING: <strong>$10,000.00</strong></span>
            <span>LEDGER: <strong>ACC-882194</strong></span>
            <span>RUNTIME: <strong>Node / Express v2.4.0</strong></span>
          </div>

          <div className="dashboard-footer-links">
            <button 
              className="dashboard-footer-btn"
              onClick={() => setActiveTab('rules')}
              title="Inspect L1-L7 Security Rules"
            >
              Security Rules
            </button>
            <span>&bull;</span>
            <button 
              className="dashboard-footer-btn"
              onClick={() => setActiveTab('flow')}
              title="Inspect Blue-Team Prompt Pipeline"
            >
              Prompt Flow
            </button>
            <span>&bull;</span>
            <button 
              className="dashboard-footer-btn"
              onClick={() => navigate('/')}
              title="View Public Architecture Landing Page"
            >
              Landing Page &rarr;
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
