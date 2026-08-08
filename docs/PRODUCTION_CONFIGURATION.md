# Production Android configuration

**Configuration frozen:** 2026-08-08

## Identity and version

| Property | v1.0 value |
|---|---|
| App name | Flow Hijacked |
| Expo slug | `flow-hijacked-android` |
| Expo owner | `flowhijacked1s-team` |
| EAS project | `c20009e1-5656-4253-83b4-75a644403efc` (`flow-hijacked-android`) |
| Android application ID | `com.flowhijacked.app` |
| Public version | `1.0.0` |
| Local baseline versionCode | `1` |

The package ID must not change after the first Play artifact is created. EAS uses `appVersionSource: remote`; the production profile uses `autoIncrement: true` and explicitly selects remote signing credentials. EAS therefore owns and increments the Play `versionCode` for every production build while the human-facing version stays deliberate. The exact EAS build number and build ID must be copied into each Release Readiness Report.

## Environments and network boundary

- EAS profiles explicitly select `development`, `preview`, or `production`.
- Production builds pin both API and canonical content to `https://flowhijacked.com`.
- Public `EXPO_PUBLIC_*` values contain no secrets. Code treats them only as configuration and rejects malformed, cleartext, or non-Flow-Hijacked origins.
- The generated release manifest sets `android:usesCleartextTraffic="false"`.
- `/api/ask` is the model boundary; no OpenAI or provider API key exists in app configuration or client source.

## Release behavior

- Expo dev-client network inspection is disabled through the production prebuild configuration.
- Expo updates are not enabled in the current native project, so the Play-tested JS/native pair cannot silently diverge after review.
- Android backup is disabled, and SecureStore's backup integration is also disabled.
- SQLCipher is compiled into the app; Recovery, Ask, and Reading remain separate stores.
- R8 minification/resource shrinking remain at the Expo/RN defaults for v1.0. Enabling them immediately before launch without a complete signed-device regression run would add more risk than value; this is a size optimization, not a security boundary.
- Debug manifests permit cleartext only for debug/debug-optimized developer builds. They are not merged into the production variant.
- The checked-in generated release Gradle file contains only the standard debug-signing placeholder. Current EAS Build creates `android/app/eas-build.gradle`, injects the remote credential configuration and imports it into the application Gradle build before running `:app:bundleRelease`. A candidate still signed with the debug certificate is invalid and must never be uploaded.

## Secrets, maps, and diagnostics

- Keystores, credentials, service-account JSON, `.env` secrets, and signing passwords are prohibited from source control and release ZIPs.
- JavaScript source maps/native debug symbols, if uploaded to a crash service or Play Console, are release artifacts with restricted access. They must never be public store assets.
- Sensitive Ask questions, Recovery state, database keys, and raw response bodies must not be included in logs, source-map metadata, crash breadcrumbs, or analytics.
- The production EAS profile explicitly disables the sensitive-screen capture override. The isolated `store-preview` APK profile enables it only for staged non-sensitive Play artwork and must never be uploaded to a Play track.

The privacy-conscious crash/ANR implementation and final symbol-upload route are evaluated under Release Gate 17; they do not weaken these production boundaries.
