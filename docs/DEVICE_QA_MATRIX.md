# Signed-device and lifecycle QA matrix

**Source/static audit completed:** 2026-08-08  
**Play-delivered artifact execution:** pending production AAB/internal track

## Required coverage

| Platform/device | Screen / density | Priority |
|---|---|---|
| Android 10/11 edge device | 320–360 dp, mid/low memory | launch, storage, WebView, local reminders |
| Android 12 | small Samsung-class phone | process/activity recreation, RTL |
| Android 13 | Pixel-class | notification permission denied/accepted |
| Android 14 | large Samsung-class phone | large font, landscape, app links |
| Android 15 | OnePlus/Xiaomi-class | background limits, intermittent network |
| Android 16 / API 36 | Pixel emulator/device with 16 KB pages | all native libraries, SQLCipher, Skia, WebView |
| Large Android/tablet | resizable landscape | reading/Atlas/Field adaptive layout |

Representative OEM coverage: Pixel, Samsung, Xiaomi/Redmi, OnePlus and one additional non-Pixel implementation. Internal testing may use physical owners/beta participants where this build host lacks device farms.

## Lifecycle protocol per release candidate

Run: fresh install; upgrade from versionCode 1 test seed; force stop/process kill; activity recreation; 30-minute and overnight background; reboot; low-memory eviction; uninstall/reinstall; airplane mode; intermittent/slow network; DNS/API failure; locale change both directions; cold/warm app link; notification permission denied/accepted; screen rotation on reading, Atlas and Field.

For each state exercise Smallest Return, quiet check-in, routes/action feedback, saved Ask answer deletion, new Ask offline/timeout, Here and Now, cached/uncached Explore, external support and settings. Verify exact resume/deletion behavior after process death.

## Defect ledger

| ID | Severity | Status | Finding |
|---|---|---|---|
| ASK-P1-001 | P1 | Open / server | Explicit immediate-danger live Ask response selected a lecture as the best next step. Android local routing mitigates explicit phrases; server guarantee still required. |
| QA-P1-002 | P1 | Pending test | Signed AAB, merged manifest, 16 KB device and Play-delivered install cannot be exercised before EAS/Play owner access. |
| PRIV-P1-003 | P1 | Open / operator | Public privacy policy lacks Android addendum and verified processor/retention/contact facts. Must be deployed before closed test/public listing. |
| LINK-P2-001 | P2 | Pending certificate | `assetlinks.json` cannot be finalized before production signing SHA-256 exists. |
| OBS-P2-002 | P2 | Accepted | No third-party JS error telemetry; Android vitals/pre-launch + local error boundary used for privacy-minimal v1. |

No P0 is known. Public release is blocked while any P1 remains open.
