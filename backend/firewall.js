/**
 * Bankism Threat Analyzer & LLM Firewall Core Rules
 */

const THREAT_CATEGORIES = {
  PROMPT_INJECTION: 'PROMPT_INJECTION',
  JAILBREAK_ROLEPLAY: 'JAILBREAK_ROLEPLAY',
  POLICY_OVERRIDE: 'POLICY_OVERRIDE',
  MEMO_MALICIOUS_INJECTION: 'MEMO_MALICIOUS_INJECTION',
  TOKEN_OBFUSCATION: 'TOKEN_OBFUSCATION',
  PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
  DATA_EXFILTRATION: 'DATA_EXFILTRATION',
  AMBIGUOUS_UNVERIFIED: 'AMBIGUOUS_UNVERIFIED',
  NONE: 'NONE'
};

const RISK_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  SAFE: 'SAFE'
};

// Patterns for Policy Overrides
const POLICY_OVERRIDE_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|directives|rules|constraints)/i,
  /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|rules|orders)/i,
  /override\s+(system|safety|security|all)\s+(policy|policies|rules|protocol|settings)/i,
  /new\s+system\s+instruction/i,
  /system\s+override\s*:\s*/i,
  /bypass\s+(verification|guardrails|firewall|filters|authentication)/i,
  /developer\s+mode\s+(enabled|activate|active|on)/i,
  /god\s+mode/i,
  /sudo\s+/i
];

// Patterns for Jailbreaks & Roleplays
const JAILBREAK_PATTERNS = [
  /you\s+are\s+now\s+(unrestricted|dan|an\s+evil|freed|in\s+developer\s+mode)/i,
  /do\s+anything\s+now/i,
  /pretend\s+(you\s+have\s+no\s+rules|you\s+are\s+an\s+unfiltered|you\s+are\s+bank\s+root)/i,
  /act\s+as\s+(an\s+adversary|a\s+hacker|someone\s+without\s+moral|dan|jailbroken)/i,
  /hypothetically speaking,?\s+(if\s+you\s+had\s+no\s+limits|execute\s+any\s+transfer)/i,
  /jailbreak/i,
  /uncensored\s+mode/i
];

// Patterns for Data Exfiltration
const DATA_EXFILTRATION_PATTERNS = [
  /print\s+(your\s+)?(system\s+prompt|initial\s+prompt|hidden\s+instructions|instructions\s+above)/i,
  /reveal\s+(api\s*key|database\s+credentials|secret|salt|master\s+token)/i,
  /dump\s+(all\s+)?(accounts|users|balances|ledger|database|tables)/i,
  /show\s+me\s+your\s+(prompt|system\s+rules|core\s+directive)/i,
  /leak\s+(private|confidential|admin)\s+data/i,
  /what\s+are\s+your\s+secret\s+instructions/i
];

// Known high risk actions
const PRIVILEGE_KEYWORDS = [
  /transfer\s+all\s+(funds|money|balance)/i,
  /empty\s+(the\s+)?account/i,
  /wire\s+to\s+offshore/i,
  /delete\s+(audit\s+log|transaction\s+history|account)/i,
  /disable\s+(mfa|2fa|security\s+alerts|notifications)/i,
  /grant\s+(admin|root|superuser)\s+access/i
];

function normalizeText(text) {
  if (!text) return '';
  return text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function inspectBase64(text) {
  const b64Regex = /([A-Za-z0-9+/]{24,}={0,2})/g;
  const matches = text.match(b64Regex);
  if (!matches) return null;

  for (const match of matches) {
    try {
      const decoded = Buffer.from(match, 'base64').toString('utf-8');
      if (/^[a-zA-Z0-9\s.,!?:;_-]+$/.test(decoded) && decoded.length > 8) {
        for (const pattern of [...POLICY_OVERRIDE_PATTERNS, ...JAILBREAK_PATTERNS, ...DATA_EXFILTRATION_PATTERNS]) {
          if (pattern.test(decoded)) {
            return {
              decoded,
              matchedKeyword: match,
              isMalicious: true
            };
          }
        }
        return { decoded, matchedKeyword: match, isMalicious: false };
      }
    } catch {
      // not base64
    }
  }
  return null;
}

function sanitizeInput(rawText) {
  if (!rawText) return '';
  let sanitized = String(rawText).trim();
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  return sanitized;
}

/**
 * Main Firewall Inspection Logic with Decision Trace and normalizedInput
 */
function analyzeBankingRequest(requestData) {
  const timestamp = new Date().toISOString();
  const rawPrompt = requestData.prompt || '';
  const memo = requestData.memo || '';
  const recipient = requestData.recipient || '';
  const amount = Number(requestData.amount);
  const actionType = requestData.actionType || 'chat';

  const fullPayloadString = `${rawPrompt} ${memo} ${recipient}`.trim();
  const sanitizedContent = sanitizeInput(fullPayloadString);
  const normalized = normalizeText(fullPayloadString);

  // Helper to build trace with stopping at fail
  const buildTrace = (failLayerId, failNote) => {
    const layerIds = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
    let failedEncountered = false;
    return layerIds.map(id => {
      if (failedEncountered) {
        return { layer: id, status: 'skip' };
      }
      if (id === failLayerId) {
        failedEncountered = true;
        return { layer: id, status: 'fail', note: failNote };
      }
      return { layer: id, status: 'pass' };
    });
  };

  // Layer 1: Unicode / Zero-width Normalization
  if (/[\u200B-\u200D\uFEFF]/.test(fullPayloadString)) {
    return {
      approved: false,
      riskLevel: RISK_LEVELS.HIGH,
      threatCategory: THREAT_CATEGORIES.TOKEN_OBFUSCATION,
      rationale: 'Invisible zero-width unicode characters detected. Obfuscation technique neutralized.',
      sanitizedInput: sanitizedContent,
      normalizedInput: normalized,
      timestamp,
      actionApproved: false,
      deterministicBoundaryCheck: 'FAILED',
      decisionTrace: buildTrace('L1', 'Zero-width characters evasion detected'),
      threatDetails: {
        pattern: 'Zero-width characters evasion',
        layer: 'L1_LEXICAL_NORMALIZATION'
      }
    };
  }

  // Layer 2: Base64 / Hex Obfuscation Decoder
  const b64Check = inspectBase64(fullPayloadString);
  if (b64Check && b64Check.isMalicious) {
    return {
      approved: false,
      riskLevel: RISK_LEVELS.CRITICAL,
      threatCategory: THREAT_CATEGORIES.TOKEN_OBFUSCATION,
      rationale: `Encoded malicious instruction detected in Base64 payload: "${b64Check.decoded.slice(0, 40)}..."`,
      sanitizedInput: sanitizedContent,
      normalizedInput: normalized,
      timestamp,
      actionApproved: false,
      deterministicBoundaryCheck: 'FAILED',
      decisionTrace: buildTrace('L2', 'Malicious decoded Base64 payload'),
      threatDetails: {
        decodedInstruction: b64Check.decoded,
        layer: 'L2_OBFUSCATION_DECODER'
      }
    };
  }

  // Layer 3: Policy Override & Directives
  for (const pattern of POLICY_OVERRIDE_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.CRITICAL,
        threatCategory: THREAT_CATEGORIES.POLICY_OVERRIDE,
        rationale: `Direct system instruction override detected matching security violation pattern: ${pattern.toString()}`,
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED',
        decisionTrace: buildTrace('L3', 'Direct system instruction override'),
        threatDetails: {
          patternMatched: pattern.source,
          layer: 'L3_HEURISTIC_RULE_OVERRIDE'
        }
      };
    }
  }

  // Layer 4: Jailbreak & Roleplay
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.CRITICAL,
        threatCategory: THREAT_CATEGORIES.JAILBREAK_ROLEPLAY,
        rationale: 'Adversarial jailbreak persona attempt identified. LLM guardrail protection triggered.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED',
        decisionTrace: buildTrace('L4', 'Adversarial jailbreak persona attempt'),
        threatDetails: {
          patternMatched: pattern.source,
          layer: 'L4_JAILBREAK_INTERCEPTOR'
        }
      };
    }
  }

  // Layer 5: Data Exfiltration Blocker
  for (const pattern of DATA_EXFILTRATION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.HIGH,
        threatCategory: THREAT_CATEGORIES.DATA_EXFILTRATION,
        rationale: 'Suspicious request seeking disclosure of system prompt, internal keys, or unauthorized database records.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED',
        decisionTrace: buildTrace('L5', 'Data exfiltration attempt'),
        threatDetails: {
          patternMatched: pattern.source,
          layer: 'L5_DATA_LEAK_PREVENTION'
        }
      };
    }
  }

  // Layer 6: Indirect Memo Scanner
  if (memo) {
    const memoNormalized = normalizeText(memo);
    const memoInjection = /(?:system|ignore|bypass|execute|admin|transfer\s+to|eval|script)/i;
    if (memoInjection.test(memoNormalized)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.HIGH,
        threatCategory: THREAT_CATEGORIES.MEMO_MALICIOUS_INJECTION,
        rationale: 'Malicious instructional payload or command detected within transaction memo field.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED',
        decisionTrace: buildTrace('L6', 'Malicious instruction in transaction memo'),
        threatDetails: {
          taintedField: 'memo',
          memoContent: memo,
          layer: 'L6_MEMO_PAYLOAD_SCANNER'
        }
      };
    }
  }

  // Layer 7: Deterministic Validation Boundaries
  if (actionType === 'transfer' || amount > 0 || recipient) {
    if (isNaN(amount) || amount <= 0) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.MEDIUM,
        threatCategory: THREAT_CATEGORIES.AMBIGUOUS_UNVERIFIED,
        rationale: 'Deterministic validation failed: Transfer amount is missing, non-numeric, or zero/negative.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED_INVALID_AMOUNT',
        decisionTrace: buildTrace('L7', 'Amount missing or non-positive'),
        threatDetails: {
          field: 'amount',
          value: requestData.amount,
          layer: 'L7_DETERMINISTIC_FINANCIAL_GUARD'
        }
      };
    }

    if (amount > 10000) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.HIGH,
        threatCategory: THREAT_CATEGORIES.AMBIGUOUS_UNVERIFIED,
        rationale: `Deterministic threshold exceeded: Transfer of $${amount.toLocaleString()} exceeds unverified single-action ceiling of $10,000. Stepped-up authorization required.`,
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED_THRESHOLD_EXCEEDED',
        decisionTrace: buildTrace('L7', 'Amount exceeds $10,000 threshold'),
        threatDetails: {
          amount,
          threshold: 10000,
          layer: 'L7_DETERMINISTIC_FINANCIAL_GUARD'
        }
      };
    }

    if (!recipient || recipient.trim().length < 3 || /[\r\n\t<>{}\$]/.test(recipient)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.MEDIUM,
        threatCategory: THREAT_CATEGORIES.AMBIGUOUS_UNVERIFIED,
        rationale: 'Deterministic validation failed: Recipient account or identifier is ambiguous or contains invalid control characters.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED_INVALID_RECIPIENT',
        decisionTrace: buildTrace('L7', 'Invalid or ambiguous recipient'),
        threatDetails: {
          field: 'recipient',
          layer: 'L7_DETERMINISTIC_FINANCIAL_GUARD'
        }
      };
    }
  }

  // Check Privilege keywords
  for (const pattern of PRIVILEGE_KEYWORDS) {
    if (pattern.test(normalized)) {
      return {
        approved: false,
        riskLevel: RISK_LEVELS.HIGH,
        threatCategory: THREAT_CATEGORIES.PRIVILEGE_ESCALATION,
        rationale: 'Privileged transaction instruction detected without certified multi-factor authentication or validation boundaries.',
        sanitizedInput: sanitizedContent,
        normalizedInput: normalized,
        timestamp,
        actionApproved: false,
        deterministicBoundaryCheck: 'FAILED',
        decisionTrace: buildTrace('L7', 'Privileged instruction unverified'),
        threatDetails: {
          patternMatched: pattern.source,
          layer: 'L7_DETERMINISTIC_FINANCIAL_GUARD'
        }
      };
    }
  }

  // All 7 Layers Passed
  let benignAction = 'CUSTOMER_SUPPORT_INQUIRY';
  if (actionType === 'transfer' || (amount > 0 && recipient)) {
    benignAction = 'EXECUTE_PEER_TO_PEER_TRANSFER';
  } else if (/balance|funds|how\s+much/i.test(normalized)) {
    benignAction = 'ACCOUNT_BALANCE_INQUIRY';
  } else if (/transaction|history|statement|recent/i.test(normalized)) {
    benignAction = 'TRANSACTION_HISTORY_INQUIRY';
  } else if (/card|freeze|lock/i.test(normalized)) {
    benignAction = 'CARD_MANAGEMENT_INQUIRY';
  }

  const allPassTrace = [
    { layer: 'L1', status: 'pass' },
    { layer: 'L2', status: 'pass' },
    { layer: 'L3', status: 'pass' },
    { layer: 'L4', status: 'pass' },
    { layer: 'L5', status: 'pass' },
    { layer: 'L6', status: 'pass' },
    { layer: 'L7', status: 'pass' }
  ];

  return {
    approved: true,
    riskLevel: RISK_LEVELS.SAFE,
    threatCategory: THREAT_CATEGORIES.NONE,
    rationale: `Valid banking intent confirmed (${benignAction}). All guardrails, heuristic patterns, and deterministic boundaries passed.`,
    sanitizedInput: sanitizedContent,
    normalizedInput: normalized,
    timestamp,
    actionApproved: true,
    deterministicBoundaryCheck: 'PASSED',
    decisionTrace: allPassTrace,
    intent: benignAction,
    parsedParameters: {
      actionType,
      amount: amount > 0 ? amount : null,
      recipient: recipient ? recipient : null,
      memo: memo ? sanitizeInput(memo) : null
    }
  };
}

module.exports = {
  analyzeBankingRequest,
  THREAT_CATEGORIES,
  RISK_LEVELS,
  sanitizeInput
};
