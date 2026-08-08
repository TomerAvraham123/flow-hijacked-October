# Android 16 / API 36 readiness

**Audit date:** 2026-08-08  
**Release:** Flow Hijacked Android `1.0.0`

## Decision

No React Native or Expo major-version migration was necessary. The recovered project is already on Expo SDK 57 (`expo` `57.0.11`) and React Native `0.86.2`. Expo's SDK 57 reference specifies React Native 0.86, Android compile SDK 36 and target SDK 36. The installed React Native version catalog independently specifies:

- `compileSdk = 36`
- `targetSdk = 36`
- `buildTools = 36.0.0`
- Android Gradle Plugin `8.12.0`
- NDK `27.1.12297006`

The smallest reliable release decision was therefore to keep this compatible toolchain and make those Android values explicit with the SDK-compatible `expo-build-properties` package (declared `~57.0.6`, lockfile-resolved `57.0.9`). `npx expo install --check` reports all dependencies current for the SDK, and Expo Doctor passes 20/20 checks. A speculative major upgrade would add release risk without improving API-level compliance.

Official references checked on 2026-08-08:

- https://docs.expo.dev/versions/v57.0.0/
- https://developer.android.com/about/versions/16/setup-sdk
- https://developer.android.com/about/versions/16/behavior-changes-16

## Generated-project verification

Clean Android prebuild completed after the change. The generated project contains:

```properties
android.compileSdkVersion=36
android.targetSdkVersion=36
android.buildToolsVersion=36.0.0
```

The generated activity remains resizable and does not lock orientation (`screenOrientation="unspecified"`). The app already uses edge-to-edge rendering and safe-area handling, avoiding a new Android 16 migration to a fixed desktop layout.

Expo's generated manifest currently sets `android:enableOnBackInvokedCallback="false"`. Android 16 explicitly permits this temporary predictive-back opt-out while existing back handling is validated. It preserves current Router navigation behavior but omits predictive system animations. Enabling Expo's `android.predictiveBackGestureEnabled` is therefore held until the signed API 36 build passes cold/warm deep-link, modal, nested-route and root-exit tests; it must not be switched immediately before release without that device evidence.

## Android 16 behavior areas for the signed candidate

Source configuration is complete, but the following are runtime acceptance tests on an API 36 image and the Play-delivered build:

- system back and predictive-back behavior from every Router and reading destination;
- edge-to-edge system bars, keyboard resize, dialogs, and bottom sheets;
- large-screen window resizing, landscape, and activity recreation;
- notification permission and local reminder delivery;
- WebView text selection/sharing and return to the native shell;
- 16 KB page-size runtime checks described in `ANDROID_16KB_AUDIT.md`.

Public promotion is blocked by any P0/P1 failure in that matrix, not by the clean prebuild alone.
