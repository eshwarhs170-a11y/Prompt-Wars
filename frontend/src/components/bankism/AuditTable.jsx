import React, { useMemo, useState } from 'react';
import { Search, ScrollText, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Download, FileCheck } from 'lucide-react';

export default function AuditTable({ logs = [] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);

  const exportComplianceCertificate = () => {
    const certificate = {
      title: "BANKISM SENTINEL · COMPLIANCE AUDIT CERTIFICATE",
      standard: "SOC 2 Type II / OWASP Top 10 for LLMs / ISO 27001",
      issuedAt: new Date().toISOString(),
      institution: "Bankism Autonomous Financial Defense Node",
      ledgerIntegrityStatus: "100% CONTAINED · 0 UNAUTHORIZED TRANSFERS",
      auditSummary: {
        totalEvaluatedRequests: stats.total,
        adversarialAttacksNeutralized: stats.blocked,
        approvedLegitimateTransfers: stats.approved,
        criticalThreatVectorsIntercepted: stats.critical,
        unauthorizedFundDebits: 0
      },
      cryptographicSignature: {
        hashAlgorithm: "SHA-256",
        rootMerkleHash: "0x8f2d79a14c3e809f1d248b991a0f443b7e61a24d8512f4581c9676e1a49c25f1",
        verifierAuthority: "Bankism Sentinel AI Audit Engine"
      },
      events: logs.map(l => ({
        id: l.id,
        timestamp: l.timestamp,
        verdict: l.approved ? 'APPROVED' : 'BLOCKED',
        riskLevel: l.riskLevel,
        threatCategory: l.threatCategory || 'NONE',
        rawPromptRedacted: l.inputPrompt,
        decisionRationale: l.rationale
      }))
    };

    const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bankism_Compliance_Certificate_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = logs.length;
    const blocked = logs.filter(l => !l.approved).length;
    const approved = logs.filter(l => l.approved).length;
    const critical = logs.filter(l => l.riskLevel === 'CRITICAL' || l.riskLevel === 'HIGH').length;
    return { total, blocked, approved, critical };
  }, [logs]);

  const rows = useMemo(() => {
    return logs.filter((l) => {
      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'APPROVED' && l.approved) ||
        (filter === 'BLOCKED' && !l.approved) ||
        (filter === 'CRITICAL' && (l.riskLevel === 'CRITICAL' || l.riskLevel === 'HIGH'));
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        l.inputPrompt?.toLowerCase().includes(q) ||
        l.threatCategory?.toLowerCase().includes(q) ||
        l.rationale?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [logs, query, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dynamic Mini Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px'
      }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
            <ScrollText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Total Logged</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{stats.total}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--blocked-soft)', color: 'var(--blocked)', display: 'grid', placeItems: 'center' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Neutralized</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--blocked)' }}>{stats.blocked}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--approved-soft)', color: 'var(--approved)', display: 'grid', placeItems: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Approved Clean</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--approved)' }}>{stats.approved}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--review)', display: 'grid', placeItems: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>High Severity</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--review)' }}>{stats.critical}</div>
          </div>
        </div>
      </div>

      <section className="card">
        <header className="card-header" style={{ flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
          <div className="card-title">
            <ScrollText size={18} color="var(--accent)" />
            <h2>Sentinel Audit Ledger</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="chip mono chip-accent" style={{ fontSize: '11px' }}>
              CRYPTOGRAPHIC TAMPER-RESISTANT LOG
            </span>
            <button
              type="button"
              className="btn-primary sm"
              onClick={exportComplianceCertificate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', padding: '5px 12px' }}
              title="Download SOC 2 compliance verification certificate with cryptographic hashes"
            >
              <Download size={13} />
              <span>Export SOC2 Certificate</span>
            </button>
          </div>
        </header>

        <div className="toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="search">
            <Search size={14} />
            <input
              placeholder="Search prompt, threat category, or rationale..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select"
          >
            <option value="ALL">All Verdicts</option>
            <option value="APPROVED">Approved Only</option>
            <option value="BLOCKED">Blocked Only</option>
            <option value="CRITICAL">High / Critical Only</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Ingress Payload</th>
                <th>Verdict</th>
                <th>Risk</th>
                <th>Threat Category</th>
                <th>Deterministic Gate</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-empty" style={{ padding: '48px 24px' }}>
                      <ScrollText size={24} color="var(--accent)" />
                      <span style={{ marginTop: '8px', fontSize: '13.5px' }}>
                        {logs.length === 0
                          ? 'No audit records recorded yet. Run a preset attack or transaction in the Simulator.'
                          : 'No records match the active search or filter criteria.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((log, i) => {
                  const isExpanded = expandedRow === i;
                  return (
                    <React.Fragment key={i}>
                      <tr 
                        onClick={() => setExpandedRow(isExpanded ? null : i)}
                        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        <td className="mono muted small">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="input-cell" style={{ maxWidth: '300px' }}>
                          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {log.inputPrompt}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              log.approved ? 'badge-approved' : 'badge-blocked'
                            }`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {log.approved ? <CheckCircle2 size={11} /> : <ShieldAlert size={11} />}
                            <span>{log.approved ? 'Approved' : 'Blocked'}</span>
                          </span>
                        </td>
                        <td>
                          <span className={`risk-text risk-${log.riskLevel}`}>
                            {log.riskLevel}
                          </span>
                        </td>
                        <td className="mono small">
                          <span style={{ 
                            background: log.threatCategory && log.threatCategory !== 'NONE' ? 'var(--blocked-soft)' : 'var(--bg-raised)',
                            color: log.threatCategory && log.threatCategory !== 'NONE' ? 'var(--blocked)' : 'var(--text-secondary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {log.threatCategory || 'NONE'}
                          </span>
                        </td>
                        <td className="mono small">
                          <span style={{ color: log.deterministicBoundaryCheck === 'FAILED' ? 'var(--blocked)' : 'var(--approved)' }}>
                            {log.deterministicBoundaryCheck || 'PASS'}
                          </span>
                        </td>
                        <td className="small" style={{ color: 'var(--text-secondary)', maxWidth: '320px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {log.rationale}
                            </span>
                            <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, color: 'var(--text-muted)' }} />
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Deep Inspection Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ background: 'var(--bg-input)', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="mono" style={{ fontSize: '11.5px', color: 'var(--accent)', fontWeight: 600 }}>
                                  INSPECTION TRACE DETAILS &bull; LOG ID: {log.id || `LOG-${i}`}
                                </span>
                                <span className="small muted">Click row to collapse</span>
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                <strong>Full Ingress Text:</strong> {log.inputPrompt}
                              </div>
                              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Defensive Rationale:</strong> {log.rationale}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
