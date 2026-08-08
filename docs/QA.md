# QA and experience audit

## Automated verification

The delivery was checked with:

| Check | Result |
|---|---|
| TypeScript `tsc --noEmit` | Pass |
| ESLint, zero warnings allowed | Pass |
| Jest suites | 8 passed |
| Jest assertions | 37 passed |
| Accessibility tokens | 48 dp minimum target and AA contrast assertions pass |
| Recovery geometry | narrow-width and bounded geometry assertions pass |
| Expo Doctor | 20/20 checks passed |
| Expo web static export | Pass |
| Android Expo prebuild | Pass |
| Secret scan | Pass; file names only on failure |
| 16 KB source baseline | 2/2 64-bit Expo SQLite JNI libraries aligned to `0x4000` |

The tests cover Ask request/consent behavior, bilingual completeness, canonical content mappings, Field geometry/route constraints, notification opt-in behavior, settings accessibility and visual-system tokens.

## Security and privacy inspection

- no model/API credential is present in source or app configuration;
- Android backup is disabled;
- external-storage and overlay permissions are blocked;
- encrypted storage is isolated by Recovery, Ask knowledge and reading continuity;
- Ask Recovery-context permission is not persisted and resets after successful use;
- hybrid content is restricted to the first-party HTTPS origin;
- notification permission is requested only during explicit enablement;
- individual deletion controls exist for each sensitive continuity domain.

### Dependency advisory review

`npm audit --omit=dev` reports graph-level findings through Expo/React Native build tooling. The actionable `sharp`/libvips finding was removed by upgrading the build-only asset tool to `0.35.3`. High-severity denial-of-service advisories remain in `image-size@1.2.1`, reached through Metro, plus a moderate `uuid@7.0.3` advisory reached through Expo's Xcode configuration tooling. The `image-size` advisories list every published version through 2.0.2 as affected and provide no patched version. Metro is a Node build tool and is not executed inside the Android application. The build pipeline must accept image assets only from reviewed repository changes, must not expose Metro as a public image-processing service, and should upgrade as soon as Expo/Metro publishes a compatible fix. A forced transitive override was deliberately avoided because it would neither remediate the current advisory nor preserve a supported Expo dependency graph.

## Manual device matrix required before Play production

Automated export and native prebuild do not replace device rendering. Run every primary flow in both languages across:

| Axis | Required cases |
|---|---|
| Width | 320–360 dp narrow phone, 393–430 dp large phone, compact tablet |
| Orientation | portrait; landscape on reading, Atlas and Field |
| Text | default, 130%, 160%, 200%; longest Hebrew and English strings |
| Direction | English LTR, Hebrew RTL, mixed scientific notation/DOIs |
| Accessibility | TalkBack, switch access/focus, reduced motion, high contrast |
| State | first use, returning, empty, populated, low capacity, offline, slow network |
| Performance | mid-range Android, low-memory process restart, resume from background |

Inspect specifically for clipped Hebrew, overlapping Atlas labels, inaccessible citations, tab-bar truncation, scroll traps, WebView-looking transitions and unwanted movement in quiet/reduced-motion modes.

## Core-flow audit

### Person with very little capacity

Now exposes three choices. “Notice a change” can end after Better / About the same / Harder / Not sure. Quiet mode reduces movement and each route can collapse to one action plus an exit. No login, score or streak blocks value.

### Returning user

Continue restores recent Field state, an exact saved Ask answer or reading position. Items are presented as available paths, not debt. Notifications are optional and use non-demanding language.

### Loved one

Here and Now includes a differentiated relational lens. Trust and repair content preserves boundaries and avoids treating another person's trust as a recovery reward.

### Addiction therapist

Field output distinguishes observation, association and inference. Therapy routes describe mechanisms, fit and limits rather than declaring a treatment winner. The weekly reflection does not infer causality from sparse personal entries.

### Scientifically curious reader

Explore exposes lectures, Brain Atlas, neuromodulation, therapy and research through canonical paths, citations and semantic Ask handoffs. Scientific depth remains available without occupying the low-capacity home surface.

## Known release-bound limitations

- No Android SDK/emulator or release signing credentials were available in the build environment, so a signed APK/AAB and screenshot matrix are not claimed.
- The deployed web-cookie authentication contract is not safe to present as native account sync; account continuity remains local until the mobile token facade ships.
- The deployed Ask endpoint lacks a structured Recovery-context field. Version 1 uses a bounded one-answer compatibility adapter and documents the required replacement.
- Here and Now ships with a bilingual deterministic offline set because a versioned production daily-content API was not available.
- Brain Atlas uses the controlled hybrid surface for the existing complex interactive experience; native shell behavior and origin restrictions are implemented, while device-level label QA remains required.
- The live Ask server currently selects a lecture as the primary destination for an explicit immediate-danger audit prompt. Local Android routing mitigates explicit phrases, but the server correction is P1 and blocks public release.
- The public privacy policy still requires the prepared Android addendum plus operator-verified processor/retention/contact facts before closed/public testing with real users.
