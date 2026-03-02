# Development Log

## 2026-03-02

### Completed

- Initialized repository with Next.js 16 + React 19 + TypeScript baseline.
- Added auth entry pages (`/sign-in`, `/sign-up`) and middleware protection for `/dashboard`.
- Added dashboard authenticated shell and server-side sign-out action.
- Added foundation helpers:
  - `requestId` generator
  - unified API error contract helper
  - lazy env accessor for build-time safety
  - Supabase server/client/service-role split
- Added core schema migrations:
  - `profiles`
  - `subscriptions`
  - `credit_accounts`
  - `credit_transactions`
  - `offer_copy_generations`
  - `webhook_events`
- Added atomic credits consume function (`consume_credits`) and API endpoint (`POST /api/credits`).

### Phase-4 Vertical Slice Delivered

- Dashboard Offer Copy panel under `/dashboard`:
  - input fields: `product`, `audience`, `valueProp`, `tone(专业/简洁/活泼/高级)`
  - submit to `POST /api/ai/offer-copy`
  - render structured output: `headline/subheadline/bullets/cta`
  - render `requestId` for traceability
- Credits consume flow integration:
  - generation path consumes 1 credit before output generation
  - generation failure triggers compensation rollback helper
  - added rollback migration function `rollback_credits`
- History baseline:
  - list reads `GET /api/history?limit=12&offset=0`
  - dashboard renders `created_at + headline`
  - added delete endpoint `DELETE /api/history/:id` with structured errors
- Validation and i18n hygiene:
  - centralized Offer Copy tone constants in UTF-8 Chinese
  - write APIs use Zod payload validation (including history delete param)
  - query parsing for history list uses validated bounds

### Verification

- `npm run build` passed after this batch.

### Next

1. Connect Offer Copy generation to real LLM provider and add output moderation guardrails.
2. Add regression tests for credits consume/rollback and history delete ownership checks.
3. Complete webhook idempotency and subscription state sync workflow.
