# Google Play Console submission inputs — v1.0

Prepared against current Play requirements on 2026-08-08. Reconcile labels against the owner's live Console because account-specific tasks can differ.

## Create app

| Field | Value |
|---|---|
| App name | Flow Hijacked |
| Default language | English (United States) — `en-US` |
| App or game | App |
| Free or paid | Free (Play does not allow a free app to become paid later) |
| Package | `com.flowhijacked.app` — fixed once the first AAB is uploaded |
| Category | Health & Fitness |
| Contains ads | No |

Do not select paid, in-app products or subscriptions for v1.0. No advertising SDK or purchase flow exists.

## App content

| Declaration | Prepared answer |
|---|---|
| Privacy policy | `https://flowhijacked.com/privacy` only after the Android addendum and real contact/processor facts are deployed |
| App access | All functionality available without special access; no account/login in Android v1 |
| Ads | No |
| Target audience | 18 and over; not designed for or marketed to children |
| News app | No |
| Government app | No |
| Financial features | No |
| Health apps | Yes; use `HEALTH_DECLARATION.md` |
| Account deletion | App does not allow account creation; do not claim an account-deletion URL for v1 |
| Data Safety | Use `DATA_SAFETY_WORKSHEET.md` only after operator facts and final AAB inventory are resolved |

Content rating must answer the Console's exact current questions honestly. The app contains educational discussion of addiction/substances and an urgent-support route; it does not promote drug use, depict graphic harm, enable user-to-user sharing, gambling, sexual content or violence. Do not minimize recovery content to obtain a lower rating.

## Store presence

- localized listing: `listing-en-US.md`, `listing-he-IL.md`;
- 512×512 icon: `icon-512.png`;
- 1024×500 feature graphic: `feature-graphic.png`;
- phone story: `SCREENSHOT-CHECKLIST.md`;
- website: `https://flowhijacked.com`;
- support URL currently points to canonical About/support material; replace with a dedicated monitored support path if available;
- developer/contact email, legal address, countries/regions and developer name are owner/legal inputs and must match the verified Play account.

## Release order

1. upload the signed AAB to Internal testing, never Production;
2. resolve Play pre-launch, policy and device defects;
3. promote a corrected build to Closed testing;
4. if the account is a personal account created after 13 November 2023, the live Console currently requires at least 12 testers continuously opted in for at least 14 days before applying for production access;
5. submit production-access answers using actual beta engagement/feedback;
6. create the Release Candidate and monitor the initial release closely. Google currently permits percentage staged rollouts only for **updates**, not the first publication. Control first-launch exposure through the closed beta, deliberate country availability and support readiness; use staged percentages for v1.0.x updates.

Internal testing is limited to 100 testers and is exempt from the public Data Safety section, but privacy/safety P1s still must be resolved before involving real recovery users.
