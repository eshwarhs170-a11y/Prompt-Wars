import React from 'react';
import { Landmark, ArrowUpRight } from 'lucide-react';

const money = (n, opts = {}) =>
  Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });

export default function LedgerView({ account, transactions = [] }) {
  return (
    <div className="ledger">
      <section className="card ledger-hero">
        <div className="hero-top">
          <span className="hero-account mono">{account?.accountNumber}</span>
          <span className="hero-tier">{account?.tier || 'Standard'}</span>
        </div>
        <div className="hero-balance mono">
          ${money(account?.balance)}
          <span className="hero-currency">{account?.currency || 'USD'}</span>
        </div>
        <div className="hero-meta">
          <span>Account Holder: <strong>{account?.accountHolder}</strong></span>
        </div>
      </section>

      <section className="card">
        <header className="card-header">
          <div className="card-title">
            <Landmark size={18} />
            <h2>Verified Transactions</h2>
          </div>
          <span className="card-meta">Executed only after firewall approval</span>
        </header>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Recipient</th>
                <th className="right">Amount</th>
                <th>Memo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-empty">
                      <ArrowUpRight size={20} />
                      <span>No transactions executed yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="mono accent">{tx.id}</td>
                    <td className="mono muted small">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                    <td>{tx.type}</td>
                    <td>{tx.recipient}</td>
                    <td className="right mono approved-text">
                      ${money(tx.amount)}
                    </td>
                    <td className="muted italic">{tx.memo}</td>
                    <td>
                      <span className="badge badge-approved">{tx.status}</span>
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
