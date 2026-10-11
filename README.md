# Bankism: Blue-Team AI Defensive Firewall & Guardrail Gateway

> **Prompt-Wars Competition Submission**  
> **Vertical:** Financial Services & Core Banking Security  
> **Live Web Demo:** [https://bankism-gold.vercel.app/](https://bankism-gold.vercel.app/)  
> **Repository:** Public · Single Branch (`main`) · Size: < 1 MB  

---

## 1. Chosen Vertical & Problem Statement
* **Vertical:** Banking, FinTech & Core Financial Transactions.
* **Problem:** Conversational LLM banking assistants face adversarial prompt injection, DAN (Do Anything Now) jailbreaks, and hidden memo payload smuggling aimed at executing unauthorized fund transfers, bypassing balance policies, or exfiltrating private account records.
* **Solution:** **Bankism** sits as a zero-trust defensive perimeter in front of core banking APIs. It enforces a strict **L1–L7 layered inspection pipeline** ensuring language models never have direct or unchecked discretion over customer funds or database mutations.

---

## 2. Approach, Architecture & Logic (L1–L7 Pipeline)

```
Untrusted Natural Language Ingress (User Prompt + Amount + Recipient + Memo)
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BANKISM BLUE-TEAM DEFENSE MATRIX                     │
├────────────────────────────────────────────────────────────────────────┤
│ L1: Unicode & Homoglyph Normalizer (strips \u200B zero-width chars)    │
│ L2: Base64 & Hex Sandbox Decoder (unpacks obfuscated payloads)        │
│ L3: Directive & Policy Override Shield ("ignore rules" blocked)        │
│ L4: Adversarial Jailbreak & Roleplay Blocker (DAN persona blocked)     │
│ L5: Data Exfiltration Prevention (blocks system prompt leaks)         │
│ L6: Isolated Payment Memo Scanner (detects smuggled memo injections)   │
│ L7: Deterministic Financial Boundary Gateway (hard $10,000 ceiling)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
     [ACTION APPROVED]                                [ACTION BLOCKED]
  • Passes all L1–L7 layers                       • Quarantined at specific layer
  • Updates core banking ledger                   • Zero ledger state change (Atomic)
  • Commits transaction record                    • Emits structured JSON audit trace
```

---

## 3. Key Solution Features
1. **Interactive Threat Simulator:** Test real-world prompt injections, jailbreaks, and legitimate payments with 1-click test scenarios.
2. **SOC Overview Analytics:** Live circular SVG health gauge, attack vector distribution chart, and L1–L7 reliability telemetry.
3. **Tamper-Resistant Sentinel Audit Log:** Real-time metrics, risk severity filtering, and expandable inspection drawer for deep analysis.
4. **Execution Ledger:** Digital banking card interface tracking balance mutations, verified recipients, and total processed volume.
5. **Prompt Flow & Security Rules:** Complete architecture transparency explaining each defensive prompt and boundary rule.
6. **Fully Responsive:** Optimized for desktop and mobile displays with dynamic light/dark obsidian aurora styling.

---

## 4. Key Assumptions
1. **Zero LLM Financial Discretion:** Natural language models classify intent and threat heuristics, but **hard mathematical boundaries** (positive numeric balance, verified recipient syntax, $10,000 threshold ceiling) are enforced deterministically by code.
2. **Untrusted Metadata:** Payment notes and memo fields are treated as hostile ingress text and analyzed independently by Layer 6.
3. **Atomic Rollback:** Any blocked request automatically aborts ledger mutations.

---

## 5. Local Setup & Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Run Frontend Console
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Run Backend API (Optional)
```bash
cd backend
npm install
npm start
```
Runs at `http://localhost:5000` (`/api/health`).

---

## 6. Competition Compliance Checklist

| Rule Requirement | Status | Verification Detail |
|---|---|---|
| **Repository Size < 10 MB** | ✅ PASSED | **~133 KB** on GitHub (`node_modules` strictly excluded via `.gitignore`) |
| **Public Repository** | ✅ PASSED | `https://github.com/eshwarhs170-a11y/Prompt-Wars` |
| **Single Branch Only** | ✅ PASSED | Only `main` branch exists |
| **Comprehensive README** | ✅ PASSED | Documents chosen vertical, approach, logic, and assumptions |
| **Real-world Usability** | ✅ PASSED | Fully interactive firewall simulator, audit ledger, and SOC overview |
| **Code Quality & Cleanliness** | ✅ PASSED | Modular React components, strict schema validation, zero bloat |
