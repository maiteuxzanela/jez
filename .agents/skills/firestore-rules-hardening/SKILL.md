---
name: firestore-rules-hardening
description: Use only in JEZ collections when editing firestore.rules or doing security/LGPD hardening: pre-action via openjev_noul or run_pilot_poc.py, apply least-privilege rules, then openjev_score_and_diagnose before treating the change as done.
---

# firestore-rules-hardening

**Scope:** `/mnt/94CCB337CCB3130A/JEZ collections` only. Target file: `firestore.rules`.

## When to use
- Any write to `firestore.rules` / security rules for products, config, orders.
- Audit findings on LGPD/PCI (orders PII, open read/write).
- User: “ajusta as rules”, “blinda o firestore”, “LGPD no checkout”.

## Canonical pilot
`scripts/run_pilot_poc.py` — full Tri-Camada cycle:

1. **Needle 3** — `search(query="firestore.rules match /orders …", scope=["firestore.rules"], max_tokens=600)`
2. **Choice** — route to `morgan_security` (persona list in script)
3. **Noul (pre-action)** — optional guardrail before touching disk; threshold reference **≥ 0.78**; **premise gaming prohibited** (low P ⇒ change attitude / alert, do not rephrase to force pass)
4. **Apply** least-privilege rules on disk
5. **Score** — `openjev_score_and_diagnose` after real file change; cutoff **≥ 3.40**

Reference secure shape (orders — from pilot):
- `products` / `config`: public read, write if `request.auth != null`
- `orders`: create only with required keys + status enum; read/update/delete only if authenticated admin path

## Procedure (manual or script)
1. Read current `firestore.rules` (small file — read whole; else Needle scoped).
2. Draft least-privilege change; list every `allow` line and why.
3. Optional: `openjev_noul` pre-check (never force pass).
4. Edit `firestore.rules` on disk.
5. Run pilot or equivalent score; fix diagnosis on disk if `< 3.40`.
6. Deploy rules only when user/CI asks (`firebase deploy --only firestore:rules` — see global `firebase-deploy-pipeline`).
7. Robin Stop-guard still runs smoke tests on `site/` changes.

## Anti-patterns
- `allow read, write: if true` on orders/products/config.
- Scoring without a real rules edit (anti-gaming).
- Committing rule “tests” that mock Firebase Auth.
- Weakening rules to make noul pass (premise gaming).
