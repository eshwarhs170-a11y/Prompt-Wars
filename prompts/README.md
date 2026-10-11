# Bankism Defensive AI Firewall Prompt Engineering Architecture

This directory houses the versioned, auditable system prompts powering the Bankism Blue-Team Defensive Firewall pipeline.

---

## 1. Pipeline Stages & Manifest

| File | Pipeline Role | Primary Objective | Failure Mode Neutralized |
| :--- | :--- | :--- | :--- |
| [`intent_extractor.txt`](file:///c:/Users/Eshwar%20H%20S/Prompt-Wars/prompts/intent_extractor.txt) | Stage 02: Intent Parser | Converts raw natural language into structured JSON conforming to a strict schema. | Arbitrary command execution, instruction ambiguity. |
| [`injection_classifier.txt`](file:///c:/Users/Eshwar%20H%20S/Prompt-Wars/prompts/injection_classifier.txt) | Stage 03: Injection Shield | Multi-category classification against jailbreaks, DAN personas, policy overrides, and token evasion. | Prompt injection, unauthorized instruction hijacking. |
| [`memo_scanner.txt`](file:///c:/Users/Eshwar%20H%20S/Prompt-Wars/prompts/memo_scanner.txt) | Stage 06: Secondary Field Guard | Scans transaction memos and payment notes for secondary indirect prompt injections. | Smuggled instructions inside transaction descriptions. |
| [`boundary_enforcer.txt`](file:///c:/Users/Eshwar%20H%20S/Prompt-Wars/prompts/boundary_enforcer.txt) | Stage 07: Policy Gatekeeper | Enforces deterministic financial bounds: positive finite amounts, certified recipient accounts, $10,000 transaction ceiling. | Excessive unverified transfers, hallucinated fund movements. |

---

## 2. Security Design Principles
1. **Zero-Discretion Financial Execution**: The LLM NEVER directly triggers or signs a banking execution. It produces candidate intents that must clear deterministic gatekeepers.
2. **Untrusted Payload Isolation**: User prompts, recipient addresses, and memos are treated strictly as untrusted parameters, never as instructions to be obeyed.
3. **Defense-in-Depth (L1-L7)**: Normalization (L1) and sandbox decoding (L2) precede prompt evaluation, preventing zero-width and base64 bypasses.
