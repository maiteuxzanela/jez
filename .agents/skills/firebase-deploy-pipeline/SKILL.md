---
name: firebase-deploy-pipeline
description: Use when deploying Firebase projects (Hosting, Functions, Firestore rules), running npm deploy scripts, bumping service-worker cache versions, or wiring firebase-hosting CI. Covers serve/deploy/logs checklist across Panela, JEZ, and Faturamento style repos.
---

# firebase-deploy-pipeline

## When to use
- Card/task ends with “deploy no Firebase” or “Cache vN & Deploy”.
- New project needs Hosting + Functions + rules release path.
- CI: merge to `main` triggers Hosting deploy (JEZ pattern).

## Observed surface (three repos)
| Project | Pieces |
|---------|--------|
| PanelaBuild | `PanelaAndroid/functions/package.json` scripts: `serve`, `shell`, `start`, `deploy`, `logs`; Expo app + Firebase config |
| JEZ collections | Same functions script set + `.github/workflows/firebase-hosting-merge.yml` (push `main` → Hosting) |
| Faturamento | `bot_faturamento/functions` serve/deploy/logs; PWA `auditoria-guias/` with `sw.js` cache-bump ritual |

## Standard npm script set (Functions)
```json
{
  "serve": "firebase emulators:start",
  "deploy": "firebase deploy",
  "logs": "firebase functions:log"
}
```
(Adjust emulator/project flags to repo conventions.)

## Deploy checklist (pre-flight)
1. **Working tree** — intended changes only; no `credentials*.json` or `.env` with live secrets (see `secret-scan-hardcoded`).
2. **Config** — `firebase.json`, `.firebaserc` project id correct.
3. **Rules** — `firestore.rules` / storage rules reviewed (JEZ: prefer noul pre-edit pattern if doing a risky rules change).
4. **Tests/guards** — Stop-guard green if hooks exist (Panela Jest, JEZ smoke).
5. **Run deploy** — `npm run deploy` (or `firebase deploy --only hosting,functions`).
6. **Verify** — hit health/rewrite routes; check Functions logs (`npm run logs`).

## Service worker / cache bump (PWA pattern — Faturamento)
Before Hosting release of a static PWA that uses `sw.js`:
1. Increment cache version identifier in `sw.js` (vN → vN+1).
2. Deploy Hosting so clients pick up the new SW.
3. Log the cache version on the Kanban card (repo convention).

## CI Hosting (JEZ pattern)
`.github/workflows/firebase-hosting-merge.yml`:
- Trigger: push to `main`.
- Action: Firebase Hosting deploy with CI secret (`FIREBASE_TOKEN` or workload identity — **never** commit the token).
- Protect `main`; do not deploy from dirty local state as a substitute for CI when CI is required.

## Order for full-stack releases
```
rules (if any) → functions → hosting → SW cache bump already in hosting assets → verify
```
Skip steps only when the delta does not touch that surface.

## Anti-patterns
- `firebase deploy` with secrets echoed in CI logs.
- Forgetting SW bump → clients stuck on old assets.
- Deploying functions without emulator smoke on breaking schema changes.
- Committing service account JSON to enable “quick deploy”.
- Hardcoded master passwords in functions (see `secret-scan-hardcoded`).

## Failure handling
- Auth/project mismatch → stop; confirm `firebase login` / project alias.
- Functions deploy fail → read `npm run logs`; fix; redeploy only functions if Hosting unchanged.
- Never force a green pipeline by disabling guards/tests.
