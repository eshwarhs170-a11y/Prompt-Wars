# Bankism Machine-Readable Output Contract

This document defines the strict, machine-readable JSON verdict contract returned by the `/api/firewall/intercept` endpoint.

---

## JSON Verdict Schema Definition

```typescript
interface BankismVerdict {
  // Primary Boolean Authorization Verdict
  approved: boolean;

  // Assigned Risk Level
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Detected Threat Category
  threatCategory: 
    | 'NONE'
    | 'POLICY_OVERRIDE'
    | 'JAILBREAK_ROLEPLAY'
    | 'MEMO_MALICIOUS_INJECTION'
    | 'TOKEN_OBFUSCATION'
    | 'PRIVILEGE_ESCALATION'
    | 'DATA_EXFILTRATION'
    | 'AMBIGUOUS_UNVERIFIED';

  // Human and Machine-Readable Defensive Rationale
  rationale: string;

  // Input after Unicode normalization & zero-width character stripping
  sanitizedInput: string;

  // Exact normalized string inspected by firewall
  normalizedInput: string;

  // ISO 8601 Timestamp of inspection
  timestamp: string;

  // Mirror flag of core banking API approval
  actionApproved: boolean;

  // Deterministic Gate Result
  deterministicBoundaryCheck: 
    | 'PASSED'
    | 'FAILED'
    | 'FAILED_INVALID_AMOUNT'
    | 'FAILED_THRESHOLD_EXCEEDED'
    | 'FAILED_INVALID_RECIPIENT';

  // L1-L7 Decision Trace for visual pipeline rendering
  decisionTrace: Array<{
    layer: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
    status: 'pass' | 'fail' | 'skip';
    note?: string;
  }>;

  // Low-level detection metadata (present on failure)
  threatDetails?: {
    patternMatched?: string;
    decodedInstruction?: string;
    layer: string;
  };

  // Structured parsed parameters (present on benign requests)
  parsedParameters?: {
    actionType: string;
    amount: number | null;
    recipient: string | null;
    memo: string | null;
  };
}
```
