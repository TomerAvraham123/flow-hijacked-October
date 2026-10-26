# Android 16 KB memory-page audit

**Audit date:** 2026-08-08  
**Scope:** v1.0.0 source, generated Android project, bundled native sources/prebuilts  
**Status:** source-level readiness verified; final AAB/APK and 16 KB-device execution remain release-candidate gates

## Toolchain evidence

- Expo SDK `57.0.11` uses React Native `0.86.2`.
- React Native's version catalog selects Android Gradle Plugin `8.12.0`, Build Tools `36.0.0`, and NDK `27.1.12297006`.
- AGP is newer than the Android-documented `8.5.1` minimum for correct 16 KB zip alignment of uncompressed native libraries.
- `expo.useLegacyPackaging=false` keeps the modern packaging path.
- React Native has officially supported 16 KB Android page sizes since 0.77; this project is on 0.86.

NDK r27 does not make flexible-page support automatic for every arbitrary library. For that reason the audit also inspected this project's native build inputs rather than inferring compatibility from the NDK version.

## Native dependency audit

The native build is covered by complementary controls rather than an unsupported assumption that every package carries its own linker flag:

| Native surface | Evidence in installed source |
|---|---|
| Application/autolinked CMake build | React Native Gradle plugin `NdkConfiguratorUtils.kt` adds `-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON` unless the application has already supplied a value. This covers the generated application's new-architecture/autolinked native build. |
| React Native / Fabric | `ReactAndroid/build.gradle.kts` explicitly sets `ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`. |
| Hermes | `ReactAndroid/hermes-engine/build.gradle.kts` explicitly sets `ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`. |
| Expo Modules Core | Installed changelog records Android 16 KB page-size support; final compiled output remains subject to artifact inspection. |
| Expo SQLite / SQLCipher | Installed changelog records the SQLCipher-specific Android 16 KB fix. The selected packaged AAR was measured directly as described below. |
| Skia, Reanimated/Worklets, Screens, Gesture Handler and SVG | These are compiled/autolinked in the application native build; no independent per-package compatibility claim is made. Their final shared objects must pass the release-artifact audit. |

The packaged Expo SQLite AAR was extracted and inspected with `readelf -lW`. Its 64-bit `arm64-v8a` and `x86_64` `libexpo-sqlite.so` LOAD segments have minimum alignment `0x4000` (16,384 bytes). The 32-bit variants use `0x1000`; the Play 16 KB requirement applies to 64-bit libraries.

The package also contains optional prebuilt `libsql` and SQLite Vec binaries aligned to 4 KB. They are **not included by this application**: `expo.sqlite.useLibSQL` and `expo.sqlite.withSQLiteVecExtension` are unset/false, while SQLCipher is built from source. Enabling either optional feature later requires a fresh audit or replacement of those prebuilts.

## Repeatable artifact check

Run the repository audit against every release artifact:

```bash
npm run audit:16kb # installed Expo SQLite source baseline
scripts/audit-16kb.sh path/to/application.aab
scripts/audit-16kb.sh path/to/application.apk
```

The script extracts all 64-bit `.so` files and rejects any ELF LOAD alignment below `0x4000`. If Android SDK `zipalign` is available, APK checks also run `zipalign -c -P 16 -v 4`.

For an AAB, additionally run the current Android `bundletool` and confirm:

```bash
bundletool dump config --bundle=application.aab | grep PAGE_ALIGNMENT_16K
```

## Remaining proof before public release

Source inspection is necessary but cannot prove the final dependency graph or archive layout. Before promoting from Internal testing:

1. run this script on the EAS-produced AAB and a universal APK derived from it;
2. verify `PAGE_ALIGNMENT_16K` in Bundletool output;
3. install the Play-delivered build on an Android 16 emulator or physical device using a 16 KB kernel;
4. exercise startup, SQLCipher create/read/update/delete, Recovery Field rendering, Ask, WebView reading, background/foreground, and process death;
5. treat any native load failure or crash as P0.

No final claim of device-level compatibility is made until those artifact and runtime checks pass.

Official Android packaging reference checked on 2026-08-08: https://developer.android.com/guide/practices/page-sizes
