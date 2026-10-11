const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeBankingRequest, sanitizeInput } = require('./firewall');

dotenv.config();

const app = express();

// Configure CORS for both local development and remote Vercel production domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server) or matching vercel subdomains
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for hackathon demos
  },
  credentials: true
}));

app.use(express.json());

// In-memory Ledger & Audit Logs for Real-time Simulation
const state = {
  account: {
    accountNumber: "US-8849-0021-9923",
    accountHolder: "Alex Mercer",
    balance: 24850.75,
    currency: "USD",
    tier: "Verified Premier"
  },
  transactions: [
    {
      id: "TX-10491",
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      type: "TRANSFER",
      recipient: "sarah.connor@bank.com",
      amount: 150.00,
      memo: "Dinner split",
      status: "APPROVED"
    },
    {
      id: "TX-10492",
      date: new Date(Date.now() - 3600000 * 12).toISOString(),
      type: "TRANSFER",
      recipient: "utilities@citypower.org",
      amount: 84.20,
      memo: "Electric bill",
      status: "APPROVED"
    }
  ],
  auditLogs: [
    {
      id: "LOG-001",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      sourceIp: "192.168.1.104",
      inputPrompt: "What is my current checking account balance?",
      approved: true,
      riskLevel: "SAFE",
      threatCategory: "NONE",
      rationale: "Valid banking intent confirmed (ACCOUNT_BALANCE_INQUIRY). Passed deterministic boundary checks."
    }
  ]
};

// 1. Health & Config endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Bankism Blue-Team AI Firewall',
    version: '2.4.0-enterprise',
    deterministicCeiling: 10000,
    activeThreatSensors: 8,
    timestamp: new Date().toISOString()
  });
});

// 2. Authentication Mock
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'admin' && password === 'admin') || (username === 'analyst' && password === 'analyst')) {
    res.json({
      token: 'jwt-bankism-authenticated-session',
      user: {
        username,
        role: username === 'admin' ? 'Security Architect' : 'SOC Analyst',
        avatar: username === 'admin' ? '🛡️' : '👨‍💻'
      }
    });
  } else {
    res.json({
      token: 'jwt-bankism-authenticated-session',
      user: {
        username: username || 'analyst',
        role: 'SOC Analyst',
        avatar: '🛡️'
      }
    });
  }
});

// 3. Banking State Endpoint
app.get('/api/banking/state', (req, res) => {
  res.json({
    account: state.account,
    recentTransactions: state.transactions.slice(-10),
    auditLogs: state.auditLogs.slice(-20),
    metrics: {
      totalRequestsScanned: state.auditLogs.length,
      threatsBlocked: state.auditLogs.filter(l => !l.approved).length,
      approvedTransactions: state.auditLogs.filter(l => l.approved).length,
      firewallIntegrity: '100% OPERATIONAL'
    }
  });
});

// 4. Core Interceptor: Analyze & Filter Any Financial Request / Prompt
app.post('/api/firewall/intercept', (req, res) => {
  const { prompt, amount, recipient, memo, actionType } = req.body;

  // Run through Bankism Blue-Team AI Firewall
  const verdict = analyzeBankingRequest({
    prompt,
    amount,
    recipient,
    memo,
    actionType: actionType || (amount ? 'transfer' : 'chat')
  });

  const logEntry = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: verdict.timestamp,
    inputPrompt: prompt || `Transfer $${amount} to ${recipient} (memo: ${memo || 'none'})`,
    approved: verdict.approved,
    riskLevel: verdict.riskLevel,
    threatCategory: verdict.threatCategory,
    rationale: verdict.rationale,
    deterministicBoundaryCheck: verdict.deterministicBoundaryCheck,
    threatDetails: verdict.threatDetails || null
  };

  // Record into audit ledger
  state.auditLogs.unshift(logEntry);

  // If approved AND it was a financial transaction, execute state change!
  let executionResult = null;
  if (verdict.approved && (actionType === 'transfer' || verdict.intent === 'EXECUTE_PEER_TO_PEER_TRANSFER')) {
    const numAmount = Number(amount);
    if (state.account.balance >= numAmount) {
      state.account.balance -= numAmount;
      const newTx = {
        id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString(),
        type: 'TRANSFER',
        recipient,
        amount: numAmount,
        memo: sanitizeInput(memo || 'P2P Transfer'),
        status: 'EXECUTED_SUCCESS'
      };
      state.transactions.unshift(newTx);
      executionResult = {
        executed: true,
        transactionId: newTx.id,
        newBalance: state.account.balance,
        message: `Successfully transferred $${numAmount.toFixed(2)} to ${recipient}`
      };
    } else {
      executionResult = {
        executed: false,
        message: 'Transaction approved by firewall but failed at core banking ledger: Insufficient funds.'
      };
    }
  }

  // Return the strict, machine-readable JSON verdict with execution result and updated account
  return res.json({
    verdict,
    executionResult,
    account: state.account
  });
});

// 5. Reset Simulation Data Endpoint
app.post('/api/banking/reset', (req, res) => {
  state.account.balance = 24850.75;
  state.transactions = [
    {
      id: "TX-10491",
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      type: "TRANSFER",
      recipient: "sarah.connor@bank.com",
      amount: 150.00,
      memo: "Dinner split",
      status: "APPROVED"
    }
  ];
  state.auditLogs = [];
  res.json({ message: "Simulation state refreshed", account: state.account });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Bankism Defensive Firewall Engine] Running on port ${PORT}`);
  console.log(`[Status] Deterministic boundaries & L1-L7 Guardrails Active`);
});
