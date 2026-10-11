import React from 'react';
import { LAYERS } from './constants';

const DETAILS = {
  L1: 'Strips zero-width characters (\\u200B, \\uFEFF) and control codes, and neutralizes raw injection delimiters.',
  L2: 'Detects Base64 and hex encoded chunks in user prompts, decodes them in a sandbox, and inspects inner payload.',
  L3: 'Blocks override phrases such as "ignore previous instructions", "system override", and "developer mode".',
  L4: 'Neutralizes adversarial personas, hypotheticals designed to bypass financial rules, and DAN-style impersonations.',
  L5: 'Prevents unauthorized disclosure of system prompts, backend database schemas, secrets, and raw account ledgers.',
  L6: 'Specifically scans secondary fields (such as memos or payment notes) for embedded prompt injections targeting downstream LLMs.',
  L7: 'Enforces deterministic numeric checks: Amount > 0, validated recipient, unverified limit <= $10,000, and step-up auth flags. Ambiguous requests are unconditionally rejected.',
};

export default function RulesView() {
  return (
    <div className="rules-grid">
      {LAYERS.map((layer) => (
        <div key={layer.id} className="card rule-card">
          <div className="rule-head">
            <span className="rule-id mono">{layer.id}</span>
            <span className="status-dot">Active Guard</span>
          </div>
          <h3>{layer.full}</h3>
          <p>{DETAILS[layer.id]}</p>
        </div>
      ))}
    </div>
  );
}
