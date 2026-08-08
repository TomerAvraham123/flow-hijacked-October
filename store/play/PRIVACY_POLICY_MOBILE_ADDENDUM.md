# Android application addendum for the public Flow Hijacked privacy policy

**Prepared:** 8 August 2026  
**Publish at:** `https://flowhijacked.com/privacy` as normal responsive HTML, not as a download

The current public policy accurately describes the website but must add the following Android-specific sections before closed testing.

## Flow Hijacked Android

The Android application can be used without creating or signing into an account. Version 1.0 does not create an Android account or synchronize identity data.

Recovery Field entries, Smallest Returns and intervention feedback are stored by default only on the device in a dedicated SQLCipher-encrypted database. Ask knowledge continuity and saved Ask answers use a second encrypted database. Reading continuity uses a third. Each database has a separate random key protected by Android's device security, Android backup is disabled, and each domain can be deleted separately in Settings → Privacy. Deletion removes the database and its key.

## Ask in the Android application

A question is sent over HTTPS to Flow Hijacked only when the user presses Ask. It is processed by the Flow Hijacked server and its external model service to construct the requested grounded answer. Question text is not sent to ordinary product analytics and is not stored in the Flow Hijacked application database; model response storage is disabled. [OPERATOR: state any security/abuse-log exception, processor legal name, processing regions, and verified retention period.]

Ask knowledge memory is off by default. If enabled, the application may include structured language/depth/style preferences and concepts/resources already explored with a future Ask request. It does not silently include Recovery history.

“Use my Recovery Field for context” is optional and applies to one answer. It can send only categorical `sleep`, `stress`, and `connection` states. It does not send full history, notes, or unrelated Recovery data. The permission resets after use.

Ask feedback sends only a feedback result, retrieval-confidence band, language, and a fixed destination value. It does not send the question, answer, topic, Recovery state, user ID, device ID, or free text.

## Reading and reminders

Reading position, saved items, and recent items stay in the encrypted Reading database. Canonical Flow Hijacked pages loaded in the integrated reader make normal HTTPS requests to the Flow Hijacked website; the site's aggregate measurement described above therefore applies to those pages. Local reminders are scheduled by Android only after explicit opt-in. Version 1.0 does not register a remote push token.

## Safety and external services

Explicit immediate-danger language is recognized locally so the application can show urgent human-support information without waiting for Ask. The text is not sent to a safety analytics service. If the user chooses “Find a verified helpline near me,” Android opens Find A Helpline, an external ThroughLine service. Flow Hijacked does not append the Ask question or Recovery Field to that link. External services apply their own privacy policies.

## Diagnostics and network providers

Version 1.0 contains no advertising SDK and no third-party behavioral analytics or crash-reporting SDK. Flow Hijacked and its hosting/security providers necessarily process ordinary connection information to deliver and protect HTTPS requests. [OPERATOR: name hosting/Cloudflare/model subprocessors; state IP, bot-cookie, access-log and aggregate-measurement retention and international-processing safeguards.]

## Controls and contact

Users can delete Recovery, Ask, and Reading data independently in Settings → Privacy, turn Ask memory off, stop one-answer Recovery context use, cancel reminders, clear app data in Android settings, or uninstall the app. Because Android v1.0 does not create accounts, there is no Android account to delete.

For privacy questions or a request concerning server-side data, contact: **[OWNER: insert a monitored privacy email and controller/legal identity/address required by applicable law]**. State the expected response/deletion time and any lawful retention exceptions.

## Publication blockers

Do not publish the bracketed operator/owner placeholders. The deployed page must contain an “Android application” heading discoverable by page search and must retain the visible Updated date.
