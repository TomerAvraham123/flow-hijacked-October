# Android release runbook

## Reproducible verification

```bash
npm ci
npm run assets
npm run typecheck
npm run lint
npm test -- --coverage=false
npm run audit:secrets
npm run audit:16kb
npx expo-doctor@latest .
EXPO_NO_TELEMETRY=1 npm run export:web
EXPO_NO_TELEMETRY=1 npm run prebuild
npm audit --omit=dev
```

`android/` is included in this delivery for native inspection. The prebuild script is intentionally clean and will regenerate it from `app.json` and Expo plugins. API 36 configuration and the native 16 KB audit are documented in `ANDROID_API36_AUDIT.md` and `ANDROID_16KB_AUDIT.md`.

Review the dependency-advisory note in `docs/QA.md`. Until a patched Metro-compatible `image-size` exists, build only reviewed repository assets and do not let untrusted uploads enter the Metro asset pipeline.

## Signing and EAS

Signing material is not source code and is not included. In the release owner account:

```bash
npx eas-cli login
npx eas-cli init
npx eas-cli credentials --platform android
npx eas-cli build --platform android --profile production
```

The production profile creates an Android App Bundle. Remote EAS versioning owns `versionCode` and auto-increments every production build. Keep the upload key in EAS or the organization's secrets system. Do not place keystores, passwords, API keys or service-account JSON in the repository.

## Verified App Links

After the production certificate exists, publish this shape at `https://flowhijacked.com/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.flowhijacked.app",
      "sha256_cert_fingerprints": ["REPLACE_WITH_PRODUCTION_SHA256"]
    }
  }
]
```

Verify the deployed file and Android association before release. The manifest already requests `autoVerify` for all HTTPS paths on `flowhijacked.com`.

## Notifications

Version 1 schedules local reminders only after explicit permission and user opt-in. Firebase is not required for this behavior. Add `google-services.json`, server registration and a separate privacy review only if remote push is introduced later.

## Play Console checklist

- complete store listing in English and Hebrew;
- upload phone screenshots from a signed candidate on narrow and large Android devices;
- complete Data Safety using the final backend behavior, not assumptions from source;
- declare health-related functionality accurately and avoid diagnostic claims;
- link the public privacy policy;
- complete content rating and target-audience declarations;
- run internal testing, closed testing and pre-launch reports;
- verify account deletion/export flows once mobile authentication ships;
- review TalkBack, 200% font scaling, RTL, reduced motion and offline behavior on real devices;
- obtain clinical/safety and Hebrew editorial review before production rollout.

## Candidate acceptance

A release candidate is acceptable only when:

1. the signed AAB installs from a Play test track;
2. verified links open the intended native destination;
3. Ask never exposes a credential, reports offline failure, and the live safety case returns human/professional support;
4. Recovery context remains one-use, opt-in and allow-listed;
5. SQLCipher databases cannot be read as plaintext from an extracted release backup;
6. the full manual matrix in `docs/DEVICE_QA_MATRIX.md` passes without overlap, clipping or focus traps;
7. the Android-inclusive privacy policy and final Data Safety/Health declarations match the AAB and backend.

## Current external blockers

This source delivery cannot produce a signed production AAB without the release owner's EAS project and upload credentials. Verified App Links require the resulting production signing certificate. Public promotion is also blocked by the live Ask safety-routing defect and by the undeployed Android privacy-policy addendum/operator facts. Cross-device authentication is deliberately outside account-free v1.0 and is not a launch dependency.
