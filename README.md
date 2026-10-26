# Flow Hijacked Android

A native-first Android recovery companion and focused Flow Hijacked reading environment. The Companion owns the moment, Explore owns the depth, Ask connects them, and My Field preserves continuity without scores or streaks.

## Architecture

- Expo SDK 57, React Native, TypeScript and Expo Router.
- Native Home, My Field, Ask, Here and Now, saved/continuity and privacy surfaces.
- Skia Recovery Field with a fully semantic text equivalent.
- The existing server-side `/api/ask` remains the only OpenAI boundary; no model key is shipped in the application.
- Three separate SQLCipher stores for Recovery Field, Ask knowledge continuity, and reading continuity. Their encryption keys live in Android Keystore-backed SecureStore.
- A controlled native reading shell for canonical `flowhijacked.com` material.
- A local urgent-support surface for safety-classified Ask handoffs.
- English and Hebrew are authored together; RTL is structural rather than a mirrored afterthought.

## Run

```bash
npm install
npm run assets
npm run typecheck
npm run lint
npm test
npm run prebuild
npm run android
```

SQLCipher and notifications require a development build rather than Expo Go.

## Release prerequisites outside source control

- Final EAS project association and Android signing credentials.
- A mobile auth/session-exchange endpoint for signed-in cross-device continuity. The current v1 is deliberately honest and local-first.
- Production certificate fingerprint added to `https://flowhijacked.com/.well-known/assetlinks.json`.
- Firebase `google-services.json` only if remote push notifications are added later. Version 1 uses local, user-scheduled notifications.
- Google Play listing, Data Safety form and human privacy/safety review.

No API key belongs in `.env`, app config, EAS public variables, the JS bundle, APK or AAB.

## Delivery notes

- [Architecture](docs/ARCHITECTURE.md)
- [Backend contract and deployment gap](docs/BACKEND_CONTRACT.md)
- [Release runbook](docs/RELEASE.md)
- [Release freeze](docs/RELEASE_FREEZE.md)
- [Release-engineering change log](docs/RELEASE_CHANGELOG.md)
- [Release Readiness Report](docs/RELEASE_READINESS_REPORT.md)
- [Android 16 KB native-library audit](docs/ANDROID_16KB_AUDIT.md)
- [Android 16 / API 36 audit](docs/ANDROID_API36_AUDIT.md)
- [Production configuration](docs/PRODUCTION_CONFIGURATION.md)
- [Ground-truth Android data map](docs/DATA_MAP.md)
- [Mobile security audit](docs/SECURITY_AUDIT.md)
- [Ask production audit](docs/ASK_PRODUCTION_AUDIT.md)
- [Companion and Recovery audit](docs/COMPANION_RECOVERY_AUDIT.md)
- [Accessibility QA](docs/ACCESSIBILITY_QA.md)
- [Language audit](docs/LOCALIZATION_AUDIT.md)
- [Device/lifecycle QA matrix](docs/DEVICE_QA_MATRIX.md)
- [Observability and analytics posture](docs/OBSERVABILITY_ANALYTICS.md)
- [Play Console submission inputs](store/play/PLAY_CONSOLE_SUBMISSION.md)
- [Internal testing protocol](store/play/INTERNAL_TEST_PROTOCOL.md)
- [Closed beta protocol](store/play/CLOSED_BETA_PROTOCOL.md)
- [QA and experience audit](docs/QA.md)
- [Product-scope audit](docs/PRODUCT_AUDIT.md)
- [Google Play listing copy and assets](store/play)
