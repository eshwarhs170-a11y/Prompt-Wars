import React, { useState } from 'react';
import { LAYERS } from './constants';
import { Shield, Sparkles, Binary, ShieldAlert, UserX, KeyRound, FileSearch, Scale, CheckCircle2 } from 'lucide-react';

const LAYER_ICONS = {
  L1: Sparkles,
  L2: Binary,
  L3: ShieldAlert,
  L4: UserX,
  L5: KeyRound,
  L6: FileSearch,
  L7: Scale
};

const DETAILS = {
  L1: {
    spec: 'Strips zero-width characters (\\u200B, \\u200C, \\uFEFF) and non-printable ASCII control codes, converting homoglyphs to ASCII before LLM ingest.',
    target: 'Unicode stealth, invisible space evasions',
    type: 'Deterministic Regex & String Normalizer',
    status: 'Zero-discretion Pre-filter'
  },
  L2: {
    spec: 'Detects Base64, Hex, and URL-encoded chunks in user prompts. Decodes them within a sandbox environment and inspects inner unencoded payloads.',
    target: 'Obfuscated token bypasses',
    type: 'Sandbox Hex/Base64 Decoder',
    status: 'Zero-discretion Pre-filter'
  },
  L3: {
    spec: 'Blocks override phrases such as "ignore previous instructions", "system override", "developer mode enabled", and administrative role theft.',
    target: 'Direct system prompt overrides',
    type: 'Dual-Classifier LLM Guardrail',
    status: 'Semantic Threat Classifier'
  },
  L4: {
    spec: 'Neutralizes adversarial roleplay personas, hypothetical scenarios designed to bypass banking rules, and DAN-style (Do Anything Now) impersonations.',
    target: 'Adversarial jailbreak roleplay',
    type: 'Dual-Classifier LLM Guardrail',
    status: 'Semantic Threat Classifier'
  },
  L5: {
    spec: 'Strictly blocks disclosure of internal system prompts, backend database connection strings, schema definitions, private keys, and raw ledgers.',
    target: 'Data exfiltration & reconnaissance',
    type: 'Output Safety Redactor',
    status: 'Egress Data Quarantine'
  },
  L6: {
    spec: 'Specifically treats secondary transaction metadata (memos, notes, wire descriptions) as untrusted text, preventing smuggled secondary injection triggers.',
    target: 'Indirect memo prompt injection',
    type: 'Isolated Memo Scanner',
    status: 'Deep Heuristic Inspector'
  },
  L7: {
    spec: 'Non-negotiable hard boundary gate: Amount > $0, verified recipient syntax, ceiling limit <= $10,000, and positive core account balance check.',
    target: 'Financial drain & unauthorized transfer',
    type: 'Deterministic Gateway',
    status: 'Hard Mathematical Gate'
  },
};

export default function RulesView() {
  const [selectedLayer, setSelectedLayer] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Intro Header Card */}
      <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Shield size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>L1–L7 Autonomous Defense Specifications</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            Defense-in-depth security matrix protecting core banking APIs from prompt injections, jailbreaks, and financial drainage.
          </p>
        </div>
        <span className="chip mono chip-approved" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
          7 OF 7 LAYERS ACTIVE
        </span>
      </div>

      {/* Grid of Interactive 7 Layer Cards */}
      <div className="rules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {LAYERS.map((layer) => {
          const info = DETAILS[layer.id];
          const Icon = LAYER_ICONS[layer.id] || Shield;
          const isSelected = selectedLayer === layer.id;

          return (
            <div 
              key={layer.id} 
              className="card rule-card" 
              onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                background: isSelected ? 'var(--bg-raised)' : 'var(--bg-panel)',
                boxShadow: isSelected ? '0 12px 30px var(--accent-glow)' : 'var(--card-shadow)',
                transition: 'all 0.25s var(--ease)'
              }}
            >
              <div className="rule-head" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="rule-id mono" style={{ fontSize: '11px' }}>{layer.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{info.type}</span>
                  </div>
                </div>
                <span className="status-dot" style={{ fontSize: '11.5px' }}>{info.status}</span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                {layer.full}
              </h3>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                {info.spec}
              </p>

              <div style={{ 
                padding: '8px 12px', 
                borderRadius: '8px', 
                background: 'var(--bg-input)', 
                border: '1px solid var(--border)',
                fontSize: '11.5px',
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--text-muted)'
              }}>
                <span>Threat Target:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{info.target}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
