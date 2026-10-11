# Bankism: Blue-Team AI Firewall & Guardrail Gateway

Bankism is an enterprise-grade defensive AI firewall that intercepts and sanitizes untrusted user inputs before any privileged core banking API is executed.

---

## Architecture Overview

```
Untrusted Ingress
       │
       ▼
[Bankism AI Firewall Engine]
  ├─ L1: Unicode & Lexical Normalizer (strips zero-width chars)
  ├─ L2: Base64 & Hex Sandbox Decoder
  ├─ L3: Directive & Policy Override Shield
  ├─ L4: Adversarial Jailbreak & Roleplay Neutralizer
  ├─ L5: Data Exfiltration Prevention
  ├─ L6: Indirect Payment Memo Payload Scanner
  └─ L7: Deterministic Financial Boundary Gate ($10,000 ceiling)
       │
       ├── Approved ──► Core Financial Ledger Execution
       └── Blocked  ──► Structured Machine-Readable JSON Verdict & Audit Log
```

---

## Local Setup & Running

### 1. Backend Service
```bash
cd backend
npm install
npm run start
```
Runs at `http://localhost:5000` (`/api/health` available).

### 2. Frontend Console
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

---

## Cloud Deployment (e.g., Render + Vercel)

### Deploy Backend to Render / Railway
1. Push this repository to GitHub.
2. In **Render** (render.com):
   - Create a **New Web Service** linked to your repo.
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Copy the deployed URL (e.g., `https://bankism-api.onrender.com`).

### Deploy Frontend to Vercel
1. In **Vercel** (vercel.com):
   - Import your repository.
   - **Root Directory**: `frontend`
   - In **Environment Variables**, add:
     - `VITE_API_URL` = `https://bankism-api.onrender.com`
2. Click **Deploy**.
