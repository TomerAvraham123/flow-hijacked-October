# Accessibility QA — v1.0

**Audit date:** 2026-08-08

## Verified in source and automated tests

- standard interactive targets are at least 48 dp with at least 8 dp design spacing;
- primary, secondary, muted, teal and gold text tokens meet WCAG AA contrast against the dark canvas in automated calculations;
- text scales to 220%; screens are scrollable and no primary flow depends on fixed text height;
- shared headings use semantic header roles; status/failure messages use alert/live-region semantics;
- choices expose radio/checkbox state; language and notification choices are grouped as radio groups;
- toggles expose one switch element rather than a duplicated nested Android switch;
- bottom tabs expose selected state and reverse structurally in Hebrew;
- Field Canvas is hidden from accessibility and represented by a textual summary plus labelled controls;
- duplicate Recovery Field node controls are suppressed when the labelled domain list is present;
- the visual legend and Field state do not rely on color alone;
- reduced-motion preference and the app's quiet mode remove route transitions and ongoing field pulses;
- urgent, deletion and production-error states have direct, non-visual language;
- Android back, keyboard resize and scroll tap behavior are explicitly configured.

## Defects fixed in this pass

1. **TalkBack duplicate labels:** Canvas node targets and the domain list represented the same six dimensions. The hidden duplicate set is now excluded based on which accessible representation is visible.
2. **Ungrouped radio choices:** language and reminder schedules now expose radio-group semantics.
3. **Mixed-language metadata:** English-only meta headings on Hebrew Companion, Field, Ask memory, weekly/history, settings and onboarding screens were localized.
4. **Unrecoverable JS route error:** a bilingual root error boundary now offers one 56 dp retry action without displaying/logging exception content.

## Signed-device acceptance matrix

Source semantics cannot prove Android service behavior. Before closed testing, verify with TalkBack on the Play-delivered build:

1. linear order from screen title through primary action and bottom navigation;
2. no duplicate button names on Recovery Field, settings or notification screens;
3. focus moves into and returns from Android alerts, external browser and keyboard;
4. selected/checked state is announced for every choice and switch;
5. Ask/loading/error changes are announced once without stealing focus repeatedly;
6. 130%, 160%, 200% and maximum configured font scaling in portrait/landscape;
7. English, Hebrew and mixed DOI/scientific notation;
8. reduced motion and quiet capacity on a physical mid-range Android device;
9. 48 dp citations, close/back controls and bottom navigation under one-handed use.

Any focus trap, unreachable primary action, clipped safety copy or TalkBack-unlabelled control is P1 and blocks public release.
