import React, { useMemo, useState } from 'react';
import { Search, ScrollText } from 'lucide-react';

export default function AuditTable({ logs = [] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  const rows = useMemo(() => {
    return logs.filter((l) => {
      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'APPROVED' && l.approved) ||
        (filter === 'BLOCKED' && !l.approved);
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
    <section className="card">
      <header className="card-header">
        <div className="card-title">
          <ScrollText size={18} />
          <h2>Sentinel Audit Log</h2>
        </div>
        <span className="card-meta">Tamper-resistant intercept record</span>
      </header>

      <div className="toolbar">
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
                  <div className="table-empty">
                    <ScrollText size={20} />
                    <span>
                      {logs.length === 0
                        ? 'No audit records recorded yet. Run an attack or legitimate banking request.'
                        : 'No records match the active search or filter criteria.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((log, i) => (
                <tr key={i}>
                  <td className="mono muted small">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="input-cell">{log.inputPrompt}</td>
                  <td>
                    <span
                      className={`badge ${
                        log.approved ? 'badge-approved' : 'badge-blocked'
                      }`}
                    >
                      {log.approved ? 'Approved' : 'Blocked'}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-text risk-${log.riskLevel}`}>
                      {log.riskLevel}
                    </span>
                  </td>
                  <td className="mono small">{log.threatCategory}</td>
                  <td className="mono small accent">
                    {log.deterministicBoundaryCheck}
                  </td>
                  <td className="small muted">{log.rationale}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
