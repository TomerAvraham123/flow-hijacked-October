# Release engineering change log

## 2026-08-08 — Gates 1–4 hardening

- Established the v1.0 feature freeze and change-control boundary.
- Added `expo-build-properties` `~57.0.6`, the Expo SDK 57-compatible release, to make Android SDK and production network settings explicit.
- Pinned Android `compileSdkVersion` and `targetSdkVersion` to 36 and Build Tools to `36.0.0`.
- Disabled Expo development network inspection in generated builds and prohibited cleartext traffic in the main Android manifest.
- Pinned production API and canonical origins to `https://flowhijacked.com`; malformed, cleartext, and third-party public configuration now fails closed.
- Switched EAS Android version-code ownership to the remote source with production auto-increment, while preserving public version `1.0.0` and local baseline `versionCode` 1.
- Made EAS environment selection explicit and pinned non-secret production endpoint values in the production profile.
- Bound the source to the owner-created EAS project `c20009e1-5656-4253-83b4-75a644403efc` under canonical owner `flowhijacked1s-team` and made remote production signing credentials explicit.
- Raised the release-tool floor to current EAS CLI `21.6.0`, which provides browser-based owner authentication without exchanging passwords or access tokens in chat.
- Corrected release provenance to the SHA-256 of the owner-supplied archive and tightened API 36/16 KB evidence so it does not overclaim final-artifact compatibility.

No product feature, permission, data category, analytics behavior, or user-facing recovery logic was added by these changes.

## 2026-08-08 — Security, privacy and production-behavior hardening

- Upgraded build-only `sharp` from `0.34.5` to `0.35.3` after advisory review.
- Added repeatable high-confidence secret scanning without printing matched credential contents.
- Made Android Ask networking cookie-free, length-bounded, timeout-aware and strict about response/destination shape.
- Removed topic/question content from useful-answer feedback.
- Added local, offline-capable routing for explicit urgent-support language; recorded the live server safety-routing failure as a P1 release blocker.
- Made sensitive Ask, Recovery, continuity and privacy screens use focus-scoped Android screen-capture/recent-app protection.
- Made SQLCipher availability fail closed and made deletion erase both the database file and device-bound key even after a failed cached open.
- Corrected quiet Recovery check-ins so hidden dimensions are uncertain rather than presented as newly observed.
- Added production Ask, Companion/Recovery, security, data-map, Data Safety and Health declaration audits.
- Made the live Ask audit stream metadata case-by-case and fail deterministically on a non-support safety destination.

These are release-gate fixes inside the v1.0 freeze; no new engagement or product feature was introduced.
