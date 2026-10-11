import React from 'react';
import * as Icons from 'lucide-react';
import { ATTACK_PRESETS, BENIGN_PRESETS } from './constants';

function PresetCard({ preset, variant, onClick }) {
  const Icon = Icons[preset.icon] || Icons.Circle;

  return (
    <button
      type="button"
      className={`preset-card variant-${variant}`}
      onClick={() => onClick(preset)}
    >
      <span className="preset-icon">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="preset-text">
        <span className="preset-name">{preset.label}</span>
        <span className="preset-desc">{preset.desc}</span>
      </span>
    </button>
  );
}

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
  normalizedPreview,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <section className="card ingestion">
      <header className="card-header">
        <div className="card-title">
          <Icons.Inbox size={18} />
          <h2>Untrusted Request Ingestion</h2>
        </div>
        <span className="card-meta">Raw ingress</span>
      </header>

      <div className="card-body">
        <form onSubmit={onSubmit} className="intake-form">
          <div className="field">
            <label htmlFor="prompt" className="field-label">
              <span>Natural language request</span>
              <span className="char-count">{prompt.length} chars</span>
            </label>
            <textarea
              id="prompt"
              className="input mono"
              rows={4}
              placeholder="Enter a banking request..."
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
              <span>Memo</span>
              <span className="field-hint">Common target for indirect injection</span>
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

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <Icons.Loader2 size={16} className="spin" />
                <span>Analyzing Request...</span>
              </>
            ) : (
              <>
                <Icons.Send size={16} />
                <span>Analyze Request</span>
              </>
            )}
          </button>
        </form>

        <div className="preset-section">
          <div className="section-label">
            <span className="dot dot-blocked" />
            Adversarial vectors
          </div>
          <div className="preset-grid">
            {ATTACK_PRESETS.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                variant="attack"
                onClick={onPreset}
              />
            ))}
          </div>
        </div>

        <div className="preset-section">
          <div className="section-label">
            <span className="dot dot-approved" />
            Legitimate requests
          </div>
          <div className="preset-grid">
            {BENIGN_PRESETS.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                variant="benign"
                onClick={onPreset}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
