# Google Play Data Safety worksheet — Android v1.0

This worksheet is based on `docs/DATA_MAP.md` and the live v1.0 behavior. It is not permission to guess unanswered backend/operator facts.

## Form opening answers

| Play question | Prepared answer |
|---|---|
| Does the app collect or share required user data? | **Yes** |
| Is all collected user data encrypted in transit? | **Yes** — production endpoints and controlled content are HTTPS-only |
| Account creation | **My app does not allow users to create an account** for Android v1.0 |
| Data deletion request mechanism | Keep **draft** until the public policy exposes a monitored contact/request route and operator retention is confirmed. Local domains already have in-app cryptographic deletion. |

## Data types to declare

### Health and fitness → Health info

- **Collected:** Yes, but only when a user puts health/recovery information in an Ask question or explicitly grants the three-value Recovery context.
- **Shared:** Select **No** only if the model provider and Cloudflare are contractually service providers acting on Flow Hijacked's instructions. Otherwise legal review must select Shared.
- **Ephemeral:** The raw question/context is described as request-only and not stored in the Flow Hijacked database; confirm edge/provider retention before selecting Google's ephemeral option.
- **Required/optional:** Optional. Companion, Recovery Field, Here and Now, and Explore work without Ask or context sharing.
- **Purpose:** App functionality; personalization only when Ask memory or Recovery context is explicitly enabled.

### App activity → In-app search history / Other user-generated content

Ask questions function as knowledge queries and open-ended user input. Google category selection should conservatively include:

- **In-app search history** — Ask knowledge queries;
- **Other user-generated content** — open-ended Ask questions.

For each: Collected, optional, app functionality; not advertising/marketing. Use the same service-provider and ephemeral caveats as Health info.

### App activity → App interactions

- **Collected:** Yes.
- **Contents:** explicit Ask feedback event + confidence/language without question/topic; and website aggregate day/language/path/broad journey step on controlled canonical pages.
- **Shared:** No if Cloudflare/hosting are service providers.
- **Required/optional:** Ask feedback is optional; canonical aggregate page measurement occurs when users choose Explore content. Because the form is type-level, do not label the entire type optional unless every user can opt out across regions.
- **Purpose:** Analytics and app functionality. Not advertising.

### Device or other IDs — pending operator confirmation

Native code does not access an advertising ID, Firebase installation ID, hardware ID, or push token. The live website edge sets a Cloudflare bot-management cookie. Confirm whether Play treats the configured value as a device/browser identifier and its retention. If yes, declare **Device or other IDs**, security/fraud prevention, service-provider processing.

### Approximate location — pending operator confirmation

Native code requests no location permission. Declare approximate location only if Cloudflare/hosting retains IP-derived geography. The public policy says its aggregate measurement does not store IP addresses, but this does not by itself describe security-edge logs.

### Crash logs / Diagnostics

Current candidate includes no crash or analytics SDK and attaches no custom telemetry. Revisit this row if Release Gate 17 adds an observability provider. Google Play Android vitals does not justify adding a third-party SDK declaration to the app by itself.

## Explicitly not collected off device by v1.0

- full Recovery check-ins/history, intervention selections, or feedback;
- saved reading queue/history;
- saved Ask answers after receipt;
- notification tokens;
- contact list, SMS, call log, photos, audio, files, calendar;
- email, account ID, name, phone, payment data;
- advertising ID.

## Sharing and external links

User-initiated Android Share sheets and opening a citation/support website are excluded or treated according to Google's user-initiated transfer rule. The app does not silently attach Recovery/Ask content to those URLs.

## Submission gate

Before selecting Submit, reconcile every answer against:

1. the final AAB SDK/permission inventory;
2. Cloudflare and backend retention;
3. model-provider DPA/retention;
4. the deployed mobile-inclusive privacy policy;
5. any crash/ANR SDK added after this worksheet.
