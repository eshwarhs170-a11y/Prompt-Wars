import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

import { evaluateClientFallback } from './clientEngine';

let clientAccount = {
  accountNumber: "US-8849-0021-9923",
  accountHolder: "Alex Mercer",
  balance: 24850.75,
  currency: "USD",
  tier: "Verified Premier"
};

let clientLogs = [];

export const bankingApi = {
  getHealth: async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`, { timeout: 3000 });
      return res.data;
    } catch {
      return { status: "ACTIVE", node: "Autonomous Bankism Edge Guardrail" };
    }
  },

  getState: async () => {
    try {
      const res = await axios.get(`${API_BASE}/banking/state`, { timeout: 3000 });
      return res.data;
    } catch {
      return {
        account: clientAccount,
        recentTransactions: [],
        auditLogs: clientLogs.slice(0, 20),
        metrics: {
          totalRequestsScanned: clientLogs.length,
          threatsBlocked: clientLogs.filter(l => !l.approved).length,
          approvedTransactions: clientLogs.filter(l => l.approved).length,
          firewallIntegrity: '100% OPERATIONAL'
        }
      };
    }
  },

  intercept: async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/firewall/intercept`, payload, { timeout: 4000 });
      return res.data;
    } catch {
      // Autonomous fallback when deployed on Vercel without local backend
      const verdict = evaluateClientFallback(payload);
      const logEntry = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: verdict.timestamp,
        inputPrompt: payload.prompt,
        amount: payload.amount,
        recipient: payload.recipient,
        memo: payload.memo,
        approved: verdict.approved,
        riskLevel: verdict.riskLevel,
        threatCategory: verdict.threatCategory,
        rationale: verdict.rationale,
        decisionTrace: verdict.decisionTrace
      };
      clientLogs.unshift(logEntry);

      let executionResult = null;
      if (verdict.approved && payload.amount) {
        const amt = Number(payload.amount);
        if (clientAccount.balance >= amt) {
          clientAccount.balance -= amt;
          executionResult = {
            executed: true,
            transactionId: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            message: `Successfully transferred $${amt.toFixed(2)} to ${payload.recipient || 'recipient'}`
          };
        }
      }

      return {
        verdict,
        executionResult,
        account: clientAccount
      };
    }
  },

  resetState: async () => {
    const res = await axios.post(`${API_BASE}/banking/reset`);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    return res.data;
  }
};
