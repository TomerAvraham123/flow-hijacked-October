# Play screenshot checklist

Capture only from the signed release candidate after the manual QA matrix passes. Do not use mock content that the installed application cannot reproduce.

Required phone story, in English and Hebrew:

1. Now — “Where are you right now?” and the three primary actions.
2. Smallest Return — four low-capacity choices.
3. My Field — living visualization plus accessible state language.
4. Three routes — one accessible place to begin with quieter alternatives.
5. Ask — a grounded structured answer with a source section.
6. Here and Now — warm editorial mode.
7. Explore — movement from moment to depth.
8. Lecture reading — progress, hierarchy and semantic handoffs.

Capture at 1080×1920 or higher on a current Android phone. Also retain internal QA captures for 320–360 dp, 200% text, TalkBack focus, RTL, offline and reduced motion; those do not all need to appear in the store listing.

Sensitive production routes intentionally block screenshots. Use only the EAS `store-preview` profile from the same release commit, with staged non-sensitive check-ins/questions/answers. That profile alone compiles the exact `approved-non-sensitive-fixtures` capture override. The production profile explicitly disables it. Never capture a real person's Recovery or Ask content, and never upload the store-preview APK to a Play track.
