# Mobile backend contract

## Deployed service used by version 1

The app calls the existing server-side Flow Hijacked boundary:

```http
POST https://flowhijacked.com/api/ask
Content-Type: application/json
X-Flow-Client: android-v1
```

The request contains `question`, `language`, `depth`, `style`, optional Ask knowledge memory and optional previous-answer context. The response is parsed with a strict Zod schema before UI state is changed. Feedback is sent to `POST /api/ask/feedback`. The OpenAI credential remains exclusively on the server.

The existing website memory APIs use a browser cookie session. They are not treated as a native mobile authentication contract.

## Required production facade for cross-device continuity

Add a versioned mobile boundary without changing the canonical web APIs:

```text
POST   /api/mobile/v1/auth/exchange
POST   /api/mobile/v1/auth/refresh
POST   /api/mobile/v1/auth/revoke
POST   /api/mobile/v1/ask
GET    /api/mobile/v1/knowledge-memory
PUT    /api/mobile/v1/knowledge-memory
DELETE /api/mobile/v1/knowledge-memory
GET    /api/mobile/v1/recovery
PUT    /api/mobile/v1/recovery
DELETE /api/mobile/v1/recovery
GET    /api/mobile/v1/continuity
PUT    /api/mobile/v1/continuity
DELETE /api/mobile/v1/continuity
```

### Authentication

1. Launch Sign in with ChatGPT in an Android Custom Tab using OAuth Authorization Code + PKCE.
2. Redirect to the verified app link `https://flowhijacked.com/mobile/auth/callback` and then into `flowhijacked://auth/callback` if needed.
3. Exchange the one-time authorization code and PKCE verifier at `/api/mobile/v1/auth/exchange`.
4. Return a short-lived access token and rotating refresh token scoped to this application.
5. Store tokens in SecureStore, never AsyncStorage or logs.
6. Revoke the refresh-token family on sign-out or suspected replay.

Cookies should remain the web contract; bearer tokens should be the native contract. Do not copy browser cookies into the app.

### First-class Ask context grant

Replace the temporary compatibility line with a structured body:

```json
{
  "question": "Why does everything feel harder today?",
  "language": "en",
  "depth": "balanced",
  "style": "mixed",
  "recoveryContextGrant": {
    "scope": "single_answer",
    "consentVersion": 1,
    "facts": {
      "sleep": "low",
      "stress": "high",
      "connection": "low"
    }
  }
}
```

Server requirements:

- reject unknown dimensions or values;
- never infer consent from prior requests;
- never expand the grant into full Recovery history;
- exclude grant values from ordinary analytics and application logs;
- return which fields were used;
- expire the grant after the answer is generated;
- retain the existing structured Ask response.

### Synchronization

Recovery, knowledge and reading continuity remain separate server resources and authorization scopes. Use per-record `updatedAt`, opaque IDs and tombstones for deterministic conflict resolution. Never silently merge Recovery text into Ask memory. The client should remain usable when sync is unavailable and show the last successful sync time without red overdue states.

## Content contract

Canonical paths remain the identity of deep content. A future manifest endpoint can reduce WebView use without forking editorial content:

```http
GET /api/mobile/v1/content/manifest?language=he&since=<etag>
```

Each item should provide canonical path, content type, localized title/summary, updated timestamp, cache policy and an optional native-block representation. The website remains canonical.

## Deployment compatibility work

- Publish `/.well-known/assetlinks.json` with `com.flowhijacked.app` and the production signing SHA-256 fingerprint.
- Add mobile callback URLs to the OAuth allow-list.
- Apply explicit CORS only to bearer-authenticated mobile endpoints if required; do not weaken cookie endpoints.
- Rate-limit Ask by user/device and preserve the current retrieval-grounding behavior.
- Add structured, non-sensitive operational events only; never raw questions or Recovery text to general analytics.
