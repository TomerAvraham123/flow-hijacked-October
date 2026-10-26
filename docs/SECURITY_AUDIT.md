# Mobile security audit — v1.0 release candidate

**Audit date:** 2026-08-08  
**Package:** `com.flowhijacked.app`  
**Scope:** Android source, generated native project, dependency graph and live Ask boundary

## Findings and controls

| Area | Verified control | Release status |
|---|---|---|
| API/model credentials | No key is present in Android configuration, source or request headers. Ask calls the first-party server. Repeatable high-confidence scan: `npm run audit:secrets`. | Pass |
| Production origin | Public configuration is allow-listed to the exact `https://flowhijacked.com` origin and fails closed. Main manifest denies cleartext. | Pass |
| Ask input/output | 1,600-character client limit, 45-second abort, strict Zod response parsing, unsafe destination schemes rejected, native fetch omits cookies. | Pass |
| Recovery-context grant | Off by default; only `sleep`, `stress`, `connection`; one answer; no history or notes; reset after success or local safety diversion. Temporary compatibility encoding is documented. | Accepted v1 constraint; replace with structured server grant |
| Local sensitive storage | Three SQLCipher databases, three random 256-bit device-bound keys, cipher presence checked before use. Pending writes are serialized. | Pass; extracted-release test still required |
| Deletion | Each domain clears visible state, persisted state, encrypted file and its SecureStore key. File and key cleanup still runs after a failed cached open. | Pass in source; device test required |
| Android backup | `allowBackup=false`; SecureStore backup disabled. | Pass in generated manifest/config |
| Screens and recent-app preview | Focused Ask, Recovery, saved-answer/continuity, support and privacy screens use Android `FLAG_SECURE`; Explore/reading remains shareable. | Pass in source; device test required |
| Exported components | Generated source manifest exposes only `MainActivity`, required for launcher/deep links. Final merged AAB manifest remains a release-candidate gate. | Conditional pass |
| Deep links | HTTPS host is exact and canonical path handling rejects protocol-relative, backslash and control-character paths. App Links require production certificate and `assetlinks.json`. | Conditional pass |
| WebView | Exact first-party HTTPS allow-list; mixed content, shared/third-party cookies, multiple windows and automatic JS windows disabled. Off-origin HTTPS opens externally; non-HTTPS blocked. | Pass |
| Clipboard/logs | No clipboard API, credential logger or raw Ask/Recovery logger is present. Production network inspector is disabled. | Pass |
| Authentication/session | Android v1 has no account creation, bearer token or web-cookie sync; therefore it does not present an unsafe pseudo-session. | Pass for account-free v1 |
| Notifications | Local only and explicit opt-in; no remote push token. | Pass |
| Runtime observability | No third-party crash/behavior SDK; Android vitals is the privacy-minimal native crash/ANR source for Play builds. No sensitive breadcrumbs are attached. | Accepted residual limitation for JS-only diagnosis |

## Dependency and supply-chain review

- `expo@57.0.11` and `react-native@0.86.2` are the supported/current SDK 57 pair used by this candidate; no blind major downgrade was accepted from `npm audit fix`.
- `npm audit --omit=dev` currently reports 25 transitive findings (9 moderate, 16 high, 0 critical). The affected paths resolve through Expo/Metro/Xcode build tooling; the audit's proposed Expo 53 / React Native 0.72 downgrades are incompatible with the API 36 release toolchain and were rejected. The actionable residual paths are documented below rather than hidden.
- `sharp` was raised from `0.34.5` to `0.35.3`, removing the candidate's vulnerable libvips advisory from the asset-generation tool.
- `image-size@1.2.1` remains transitive through Metro. Both published advisories cover every available version through current `2.0.2`; there is no patched release to select. Metro/image-size is a Node build dependency, is not bundled or executed in the Android runtime, and must receive only reviewed repository assets. This is an accepted build-pipeline DoS risk, not a mobile runtime exposure.
- `uuid@7` is reached through Expo Xcode configuration tooling and is not an Android runtime path. A forced incompatible override was rejected.
- `npm ci` and the committed lockfile are required. EAS signing material and service-account JSON must never enter the source archive.

## Open P1: server safety routing

The live `/api/ask` production audit returned a structurally valid answer for explicit immediate-danger language but chose a lecture as `bestNextStep`. The Android client now routes explicit urgent phrases locally to human support before networking, including offline, but this cannot cover every safety-sensitive formulation.

Before public production, the server must guarantee that explicit immediate-danger/self-harm/overdose/violence intent returns `urgent_support` or `professional_support`, never an educational lecture as the primary next step. `npm run audit:ask:production` now fails this case deliberately. This is a release blocker, not a concealed residual risk.

## Release-candidate checks still requiring the signed AAB/device

1. inspect the merged release manifest and SDK/permission inventory;
2. run `bundletool dump manifest` and `bundletool validate`;
3. extract every packaged 64-bit `.so` and run `scripts/audit-16kb.sh` against the AAB/APKS;
4. install on a 16 KB Android 16 image and exercise SQLCipher, WebView and Skia;
5. confirm backup extraction cannot recover the three stores;
6. verify `FLAG_SECURE`, deletion, deep links and notification behavior on real devices.
