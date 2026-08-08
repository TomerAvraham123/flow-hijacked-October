# Flow Hijacked Android v1.0 — Release Readiness Report

**Report date:** 2026-08-08  
**Stage:** EAS-linked source release candidate; production AAB/internal track pending owner authentication

## Build identification

| Property | Value |
|---|---|
| App | Flow Hijacked |
| Package | `com.flowhijacked.app` |
| versionName | `1.0.0` |
| local baseline versionCode | `1` |
| Play versionCode | EAS remote auto-increment; pending first production build |
| Expo / React Native | `57.0.11` / `0.86.2` |
| Android | compile 36, target 36, Build Tools 36.0.0, AGP 8.12, NDK 27.1 |
| Source archive hash | record after packaging and Library replacement |
| EAS project | `flowhijacked1s-team/flow-hijacked-android` (`c20009e1-5656-4253-83b4-75a644403efc`) |
| EAS build ID / AAB SHA-256 | pending owner-authenticated production build |

## Completed and verified

- v1.0 feature freeze and release change control;
- API 36 production configuration and clean Android prebuild;
- source/native 16 KB dependency audit plus repeatable final-artifact script;
- HTTPS-only allow-listed production networking, no embedded model key and repeatable secret scan;
- SQLCipher fail-closed/key deletion hardening and sensitive-screen recent-app protection;
- live Ask audit across English, Hebrew, mixed language, ambiguity, rapid requests and safety;
- Companion low-capacity and Recovery personalization audit, including hidden-dimension correction;
- ground-truth data map, Data Safety worksheet, Health declaration and Android privacy addendum;
- TalkBack/static accessibility, RTL and English/Hebrew editorial audit with fixes;
- privacy-minimal crash/ANR and analytics posture;
- localized listing copy, current icon/feature graphic, screenshot plan, Play inputs, Internal and Closed protocols;
- TypeScript clean; ESLint clean; 8/8 suites and 37/37 assertions pass; Expo Doctor 20/20; 44 static routes export; secret scan pass; clean prebuild pass.

## Blocking issues

1. **ASK-P1-001 — server safety:** explicit immediate-danger prompt returned a lecture as the live `bestNextStep`. Deploy an early server safety route and make `npm run audit:ask:production` pass.
2. **PRIV-P1-003 — policy truth:** deploy the mobile addendum at `https://flowhijacked.com/privacy` after confirming processor/entity, IP/Cloudflare/model/feedback retention, regions/safeguards and a monitored privacy contact. Finalize Data Safety only afterward.
3. **BUILD-P1-004 — signed artifact:** EAS association is complete; owner authentication is still required to create/approve remote upload credentials and build the production AAB. No key may enter source or chat.
4. **QA-P1-002 — artifact/device evidence:** validate the signed AAB/manifest/permissions/Bundletool/16 KB alignment, install through Internal testing and complete the device/accessibility/lifecycle matrix. Any discovered P0/P1 must be fixed.
5. **LINK-P1-005 — App Links:** publish `assetlinks.json` using the production signing SHA-256 and verify cold/warm links.

Blocking issues must be empty before public launch.

## Accepted residual risks

- Metro's transitive `image-size` DoS advisory has no patched published release; it is build-time only and accepts reviewed repository assets only.
- no third-party JS crash SDK; Android vitals/pre-launch reports and a local bilingual error boundary preserve the minimal-data posture, with slower non-fatal JS diagnosis.
- Recovery context uses a bounded compatibility line until the structured mobile server field exists; only three explicit categorical facts are allowed.
- R8/resource shrinking stays at supported defaults for v1 to avoid late native regressions.
- predictive-back animations remain temporarily opted out using Android 16's supported manifest flag until the signed build passes the full Router/back-stack device matrix.
- Here and Now uses a deterministic bilingual offline set rather than an unavailable versioned daily API.
- the highest-cost Atlas interaction uses a restricted first-party hybrid surface.

## Known non-blocking issues

- `store-preview` is a separately marked internal APK profile solely for screenshots with staged non-sensitive fixtures; it must never enter Play.
- final store screenshots must be captured after signed-device visual QA.
- account/cross-device sync is honestly unavailable in v1 and is not advertised as present.

## Deferred v1.1+

- token-based native authentication and independently consented sync;
- first-class structured Recovery-context server contract;
- optional privacy-reviewed crash SDK or expanded aggregate product analytics;
- remote push notifications;
- richer native Atlas assets/daily content manifest;
- build-size optimization after a full R8 regression matrix.

## First-launch and rollback plan

Google Play does not support percentage staged rollout for a first publication. Release control therefore comes from Internal testing, the 20–30-person Closed beta, deliberate initial country availability and an on-call hotfix path. For v1.0.x updates, use percentage staging and halt on crash/ANR, data loss, authentication, Field, Ask, RTL/accessibility or policy regressions.

Before first publication, prepare a new versionCode hotfix build from the frozen branch, retain the last clean AAB/build ID, document the server feature flag/rollback for Ask, and ensure the owner can stop distribution or submit a corrected release without exposing signing material.
