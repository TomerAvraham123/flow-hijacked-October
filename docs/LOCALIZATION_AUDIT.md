# Hebrew and English language audit — v1.0

**Audit date:** 2026-08-08

## Automated parity

Every shared translation key has non-empty English and Hebrew content. Canonical Hebrew routing is tested, including the lecture URL exception. RTL direction is applied at the screen, text, navigation and reading-path layers rather than by mirroring English strings alone.

## Hebrew corrections in this release pass

- removed English-only meta headings from Hebrew onboarding, settings, Companion, Field, weekly/history, Ask and continuity screens;
- changed unnatural `לא בטוח לי` to `לא ברור לי`;
- changed the literal “practical movement” translation to `צעד מעשי אחד`;
- simplified the check-in accuracy instruction to spoken Hebrew;
- replaced an unclear literal route heading with `שלושה כיוונים אפשריים`;
- replaced an academic/literal corpus phrase with `מאגר התוכן של Flow Hijacked`;
- made the Ask-memory boundary impersonal and natural rather than using a masculine “remembers” voice;
- corrected singular/plural inconsistency in urgent-support copy and removed an awkward gender construction from the suggested message.

Product names (`Flow Hijacked`, `Ask`, `Explore`, Android) remain in their intended brand/technical form. Scientific abbreviations and DOI notation are not reversed or translated.

## English audit

Quick-use surfaces use direct, humane language and avoid diagnosis, compulsion, failure and score vocabulary. Error states explain what did or did not happen (“question was not saved,” “nothing was scheduled”) rather than blaming the user. Scientific and evidence-boundary terms stay in deeper Field/Explore layers.

## Remaining editorial acceptance

A native Hebrew recovery/clinical editor must read the signed build in context, including all 40+ intervention instructions and dynamic server Ask answers. This is required because string-table inspection cannot evaluate spoken rhythm, line wrapping or model-generated Hebrew. Report every correction by route and screenshot; P1 includes dangerous ambiguity, mixed direction that changes meaning, clipped safety text or a mistranslated action.
