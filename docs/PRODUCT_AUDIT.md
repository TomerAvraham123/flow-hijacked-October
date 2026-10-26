# Product-scope audit

## Implemented in version 1

| Product area | Delivered behavior |
|---|---|
| Launch and first use | branded launch, value-first onboarding, no forced account |
| Home / Now | three primary actions and a finite Continue surface |
| Smallest Return | four one-tap states; stopping immediately is valid |
| Recovery Field | structured input, living field, accessible equivalent, trajectory, history |
| Intervention routes | up to three distinct families from a 42-action bilingual library; one accessible starting place |
| Weekly reflection | pattern, stable availability, change, question and experiment; no score or causal claim |
| Ask | native entry and structured grounded answer; help-first ambiguity, follow-up, sources and feedback |
| Ask memory | opt-in knowledge-path continuity with concept-level controls |
| Recovery context in Ask | explicit one-answer grant with three allow-listed categorical dimensions |
| Here and Now | warm editorial daily reflection, core sentence, practical action and progressive lenses |
| Explore | lectures, Brain Atlas, neuromodulation, therapy, research and framework entry points |
| Reading continuity | save, resume position, share, Ask/Field handoffs and exact saved Ask reopening |
| Cross-system handoffs | bounded semantic context between Field, Ask and Explore |
| Offline | shell, native readings, saved answers, recent Field and Here and Now fallbacks |
| Notifications | optional local schedules with calm copy and owned cancellation |
| Privacy | isolated encrypted stores, separate deletion, backup disabled, no raw-text analytics integration |
| Bilingual/accessibility | English/Hebrew parity, structural RTL, TalkBack semantics, large targets, contrast tests, reduced motion |
| Android integration | native back, deep-link routes, sharing, keyboard behavior, lifecycle persistence and generated Android project |

## Deliberately not faked

| Capability | Why it remains a deployment item |
|---|---|
| Cross-device sign-in/sync | current website uses an HttpOnly cookie session; native requires token exchange |
| Verified Android App Links | production signing SHA-256 must be published on the canonical site |
| Signed Play AAB | release-owner signing credentials and Play/EAS project are external |
| Remote push | outside version 1; local user-scheduled notifications meet the brief without engagement infrastructure |
| Live daily-content API | no stable mobile endpoint/schema was available, so a high-quality offline bilingual set is used |
| Fully native 3D Brain Atlas | controlled first-party hybrid reuse prevents a costly fork of canonical interactive content |

## Guardrails retained

- no streak, XP, badge, recovery percentage or red/green grade;
- no infinite feed or missed-day debt;
- no generic chatbot bubble transcript;
- no silent merge of Ask and Recovery data;
- no unrestricted third-party WebView navigation;
- no credential in the client;
- no claim that Field geometry is literal neuroscience or a validated diagnostic instrument;
- no claim that Ask is therapy or emergency care.
