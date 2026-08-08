# Flow Hijacked Android v1.0 release freeze

**Freeze established:** 2026-08-08  
**Public version:** `1.0.0`  
**Android application ID:** `com.flowhijacked.app`  
**Incoming source-package SHA-256:** `f5c52056c042e15c4d3a3c9d23d93a8ddf0d58727a9ded828bd647b560c42524`

The incoming hash identifies the exact owner-supplied archive from which this release-engineering pass began. The revised release archive receives a separate SHA-256 in the Release Readiness Report; it must not overwrite this provenance record.

The v1.0 product scope is frozen. Changes on the release line require a clear connection to a crash, security, privacy, accessibility, Play-policy compliance, serious UX defect, build/release compatibility, localization defect, or production-backend failure.

## Change control

Every post-freeze change must record:

- the release gate or defect it addresses;
- affected files and dependencies;
- verification performed;
- whether it changes collection, processing, permissions, safety behavior, or Play declarations.

Feature ideas are not release fixes. They belong in the deferred list below unless a blocking defect makes them necessary.

## Deferred to v1.1 or later

- remote push notifications (v1.0 reminders remain local and opt-in);
- additional intervention categories or educational destinations;
- richer Brain Atlas rendering or new scientific layers;
- expanded product analytics beyond the minimal release schema;
- social, gamification, streak, score, badge, or engagement-loop concepts (not currently planned);
- any content-system fork that duplicates canonical Flow Hijacked material.

## Release invariants

- Companion remains usable without sign-in.
- Ask model credentials remain server-side.
- Recovery, Ask knowledge continuity, and Reading remain separate encrypted stores.
- Recovery context is never silently merged into Ask.
- no recovery score, diagnostic claim, streak, or shame-based return pattern is introduced.
- English and Hebrew ship with feature parity.
