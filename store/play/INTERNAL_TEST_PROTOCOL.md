# Google Play Internal testing protocol

Use the Play-delivered artifact. Expo Go, a development client or a locally installed APK does not satisfy this gate.

## Setup

1. Play Console → Flow Hijacked → Test and release → Testing → Internal testing.
2. Create/select an internal tester list (maximum 100) and add only trusted QA accounts.
3. Upload the EAS production AAB; confirm package `com.flowhijacked.app`, public version `1.0.0` and the new remote `versionCode`.
4. Add release notes in English and Hebrew and roll out to Internal testing only.
5. Testers must opt in through the Play link and install/update from Google Play.

## 30-minute smoke pass

- cold launch/onboarding in English, then switch to Hebrew and confirm RTL;
- complete Smallest Return in one tap and stop;
- quiet and standard Field check-ins, three routes and action feedback;
- Ask normal, Hebrew, mixed, offline, timeout/retry and locally routed urgent language;
- save/delete an Ask answer; delete each encrypted domain separately;
- Here and Now, cached/uncached Explore, reading resume and semantic handoffs;
- notification denied/accepted and cancellation;
- cold/warm HTTPS deep link, Android back and external support;
- background/force-stop/relaunch between each persistence boundary.

Then run the full `docs/DEVICE_QA_MATRIX.md`, inspect Android vitals and the Play pre-launch report.

## Acceptance

- P0/P1 defect count: zero;
- no plaintext store/backup recovery;
- no unsafe Ask safety destination;
- no clipped safety/privacy text at 200%;
- no TalkBack focus trap or unlabeled control;
- AAB manifest/permissions/API36/16KB checks pass;
- production screenshot protection is active on sensitive routes;
- deep links verify after `assetlinks.json` deployment.

Record tester account (non-sensitive alias), device/OS, build versionCode, locale, scenario, result and defect ID. Do not put real Ask/Recovery text into bug trackers; use staged fixtures.
