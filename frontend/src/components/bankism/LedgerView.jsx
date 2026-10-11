import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

const money = (n, opts = {}) =>
  Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });

export default function LedgerView({ account, transactions = [] }) {
  const totalVolume = transactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0);

  return (
    <div className="ledger" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Visual Bank Card Hero + Telemetry */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Holographic Digital Debit Card Mockup */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(67, 56, 202, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '210px'
        }}>
          {/* Card Chip & Network */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '30px', borderRadius: '6px', background: 'linear-gradient(135deg, #fbbf24, #d97706)', border: '1px solid rgba(255,255,255,0.3)' }} />
              <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.1em', opacity: 0.8 }}>ZERO-TRUST SECURE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
              <ShieldCheck size={14} color="#34d399" />
              <span>{account?.tier || 'Verified Premier'}</span>
            </div>
          </div>

          {/* Account Number */}
          <div className="mono" style={{ fontSize: '18px', letterSpacing: '0.18em', margin: '16px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {account?.accountNumber || 'US-8849-0021-9923'}
          </div>

          {/* Holder & Balance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Account Holder</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{account?.accountHolder || 'Alex Mercer'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Available Balance</div>
              <div className="mono" style={{ fontSize: '22px', fontWeight: 800 }}>${money(account?.balance)}</div>
            </div>
          </div>
        </div>

        {/* Ledger Telemetry Card */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="section-label" style={{ margin: 0 }}>Deterministic Guarantee</span>
              <span className="chip mono chip-approved" style={{ fontSize: '11px' }}>
                ATOMIC ROLLBACK ACTIVE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Non-Discretionary Financial Execution
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              LLMs have zero direct database access. Financial transactions cannot deduct balances without passing the <strong>$10,000 threshold boundary</strong>, verified recipient format, and zero-threat heuristic scans.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              <div className="small muted">Total Transaction Volume</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>
                ${money(totalVolume)}
              </div>
            </div>
            <div>
              <div className="small muted">Executed Payments</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 700 }}>
                {transactions.length} Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Transactions Table */}
      <section className="card">
        <header className="card-header">
          <div className="card-title">
            <Landmark size={18} color="var(--accent)" />
            <h2>Verified Execution Ledger</h2>
          </div>
          <span className="card-meta">Committed database mutations</span>
        </header>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Recipient</th>
                <th className="right">Amount</th>
                <th>Payment Note / Memo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-empty" style={{ padding: '48px 24px' }}>
                      <CreditCard size={24} color="var(--accent)" />
                      <span style={{ marginTop: '8px' }}>
                        No financial transactions executed yet. Run an approved payment in the Simulator.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="mono accent" style={{ fontWeight: 600 }}>{tx.id}</td>
                    <td className="mono muted small">
                      {new Date(tx.date).toLocaleTimeString()}
                    </td>
                    <td>
                      <span className="chip mono" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{tx.recipient}</td>
                    <td className="right mono approved-text" style={{ fontSize: '14px', fontWeight: 700 }}>
                      -${money(tx.amount)}
                    </td>
                    <td className="muted italic">{tx.memo || 'None'}</td>
                    <td>
                      <span className="badge badge-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={11} />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
