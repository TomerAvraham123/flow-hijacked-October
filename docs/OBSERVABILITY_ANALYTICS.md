# Crash, ANR and analytics posture — v1.0

## Release decision

Version 1.0 does not add Sentry, Firebase Analytics, PostHog or another behavioral/crash SDK. Adding one at the release gate would introduce a new processor, identifier/diagnostic data flow, DPA/retention decisions and a material risk that Ask or Recovery content leaks into breadcrumbs. No owner-approved observability account or privacy disclosure currently exists.

For the first Play candidate:

- Google Play Android vitals is the native crash/ANR/startup source for Play-delivered builds;
- Play pre-launch reports provide device-lab crash, accessibility and compatibility signals;
- a bilingual root error boundary prevents a route-level JS error from becoming a dead end but does not transmit exception text;
- Ask server failures are distinguishable on-device as timeout, offline, HTTP failure or malformed response without logging raw questions/responses;
- no sensitive custom breadcrumb, user ID, device ID or free text is attached.

This is the minimal privacy-conscious launch posture. Its accepted limitation is slower diagnosis of non-fatal JS-only defects. Reconsider a crash SDK only after processor/legal approval, with `beforeSend` stripping request bodies, route params, local store state, screenshots, WebView URLs/query strings, Ask/Recovery text and identifiers.

## Product analytics schema actually present

There is no native behavioral analytics SDK. The only explicit Android product event sent is Ask useful-answer feedback:

| Field | Allowed values |
|---|---|
| `event` | `feedback_yes`, `feedback_partly`, `feedback_not_quite` |
| `confidence` | `high`, `moderate`, `limited` |
| `destination` | fixed `none` |
| `language` | `en`, `he` |

It never contains the question, answer, topic, Field state, route, account, device ID or free text. Canonical Explore pages remain subject to the website's documented aggregate day/language/path/broad-step measurement.

Companion/Field opens and intervention selections are intentionally not transmitted in v1.0. Beta hypotheses are measured with consented tester feedback and Play stability data, not covert behavioral surveillance. Any future analytics expansion is a v1.1 change requiring a new data-map, policy and consent review.
