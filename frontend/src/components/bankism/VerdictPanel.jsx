import React from 'react';
import { ShieldCheck, FileJson, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import PipelineStrip from './PipelineStrip';
import JsonViewer from './JsonViewer';
import { RISK_META } from './constants';

export default function VerdictPanel({ verdict, executionResult }) {
  if (!verdict) {
    return (
      <section className="card verdict">
        <header className="card-header">
          <div className="card-title">
            <FileJson size={18} />
            <h2>Structured Verdict</h2>
          </div>
          <span className="card-meta">JSON output</span>
        </header>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>Awaiting input</h3>
            <p>Run an attack or enter a request to see the verdict.</p>
          </div>
        </div>
      </section>
    );
  }

  const approved = !!verdict.approved;
  const risk = RISK_META[verdict.riskLevel] || RISK_META.LOW;
  const riskOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const activeIdx = riskOrder.indexOf(verdict.riskLevel);
  const displayTime = verdict.timestamp 
    ? new Date(verdict.timestamp).toLocaleTimeString() 
    : new Date().toLocaleTimeString();

  return (
    <section className="card verdict">
      <header className="card-header">
        <div className="card-title">
          <FileJson size={18} />
          <h2>Structured Verdict</h2>
        </div>
        <span className="card-meta mono">{displayTime}</span>
      </header>

      <div className="card-body verdict-body">
        {/* Large Status Banner */}
        <div className={`verdict-banner ${approved ? 'is-approved' : 'is-blocked'}`}>
          {approved ? <CheckCircle2 size={28} /> : <ShieldAlert size={28} />}
          <div>
            <div className="verdict-title">{approved ? 'ACTION APPROVED' : 'THREAT BLOCKED'}</div>
            <div className="verdict-sub">
              {approved ? 'Passed all L1-L7 guardrails and boundary checks' : 'Neutralized before reaching core banking ledger'}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">Risk Level</span>
            <div className="risk-meter">
              {riskOrder.map((level, i) => (
                <div
                  key={level}
                  className={`risk-seg ${i <= activeIdx ? 'lit' : ''}`}
                  style={i <= activeIdx ? { background: risk.color } : undefined}
                  title={RISK_META[level]?.label || level}
                />
              ))}
            </div>
            <span className="meta-value" style={{ color: risk.color }}>
              {risk.label}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Threat Category</span>
            <span className={`chip mono ${approved ? 'chip-approved' : 'chip-blocked'}`}>
              {approved ? 'None' : verdict.threatCategory}
            </span>
          </div>

          <div className="meta-item" style={{ gridColumn: 'span 2' }}>
            <span className="meta-label">Deterministic Gate</span>
            <span className="chip mono chip-accent">
              {verdict.deterministicBoundaryCheck}
            </span>
          </div>
        </div>

        {/* Rationale */}
        <div className="rationale">
          <span className="meta-label">Defensive Rationale</span>
          <p>{verdict.rationale}</p>
          {verdict.threatDetails && (
            <code className="detail-line">
              Layer: {verdict.threatDetails.layer}
              {verdict.threatDetails.patternMatched && ` · Pattern: ${verdict.threatDetails.patternMatched}`}
            </code>
          )}
        </div>

        {/* Core banking execution result */}
        {executionResult && (
          <div className="execution">
            <ArrowRight size={16} />
            <div>
              <div className="execution-title">Core Banking Execution</div>
              <div className="execution-msg">
                {executionResult.message}
                {executionResult.transactionId && (
                  <span className="mono"> · Ref: {executionResult.transactionId}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* L1-L7 Decision Trace */}
        <div>
          <div className="section-label">L1–L7 Decision Trace Pipeline</div>
          <PipelineStrip trace={verdict.decisionTrace || []} />
        </div>

        {/* JSON Viewer */}
        <JsonViewer data={verdict} />
      </div>
    </section>
  );
}
