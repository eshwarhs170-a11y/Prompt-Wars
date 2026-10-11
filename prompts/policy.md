# Stage 05: Deterministic Policy Gatekeeper Specification

## 1. Zero-Trust Architecture Principle
**LLMs do not sign or execute banking transactions.**
Even if an upstream LLM parser reports high confidence or approves a request, the transaction MUST pass these non-negotiable deterministic rules implemented in the runtime code.

## 2. Deterministic Validation Boundaries (100% Identical to Code)

1. **Numeric Amount Validity**:
   - Condition: `typeof amount === 'number' && !isNaN(amount) && isFinite(amount) && amount > 0`
   - Violation Code: `FAILED_INVALID_AMOUNT`
   - Result: Blocked immediately. Negative, zero, or non-numeric values are rejected.

2. **Unverified Single-Action Ceiling ($10,000 USD)**:
   - Condition: `amount <= 10000`
   - Violation Code: `FAILED_THRESHOLD_EXCEEDED`
   - Result: Any transaction exceeding $10,000 without stepped-up multi-factor authentication (MFA) is blocked before hitting the core banking API.

3. **Certified Recipient Identifier**:
   - Condition: `recipient.length >= 3 && !/[\r\n\t<>{}\$]/.test(recipient)`
   - Violation Code: `FAILED_INVALID_RECIPIENT`
   - Result: Ambiguous, empty, or control-character containing recipient handles are rejected.

4. **Ambiguity Boundary**:
   - Condition: If request intent is incomplete, ambiguous, or lacks explicit recipient or amount parameters, the action is rejected with `AMBIGUOUS_UNVERIFIED`.

## 3. Enforcement Matrix

| Input Scenario | Deterministic Check | Verdict Action | Ledger Mutation |
| :--- | :--- | :--- | :--- |
| Transfer $50 to Alice | `PASSED` | `APPROVED` | Balance deducted |
| Transfer -$200 to Bob | `FAILED_INVALID_AMOUNT` | `BLOCKED` | None (Zero Mutation) |
| Transfer $55,000 to Partner | `FAILED_THRESHOLD_EXCEEDED` | `BLOCKED` | None (Zero Mutation) |
| Transfer to `<script>` | `FAILED_INVALID_RECIPIENT` | `BLOCKED` | None (Zero Mutation) |
