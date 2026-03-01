# Nova LaunchKit — Full Engineering Specification (Detailed)

> Status: Active Development  
> Repo: `huangkefeng-ai/nova-launchkit-20260302`  
> Internal baseline: product requirements (local-only notes, not committed)

---

## A. Product Goal
Build a production-ready SaaS starter that enables rapid MVP launch with:
- global auth
- subscription + credits
- webhook-based billing sync
- AI business utility module

### A.1 Scope Replacement Rule
Legacy feature direction **must not appear anywhere** in product scope.  
Current official AI module:
- **AI Offer Copy Studio** (generate high-conversion Chinese marketing copy)

---

## B. Technical Baseline (Pinned)
- Node.js: 24.14.0
- npm: 11.9.0
- Next.js: 16.1.6
- React: 19.2.4
- TypeScript: 5.9.3
- `@supabase/supabase-js`: 2.98.0
- `@supabase/ssr`: 0.8.0

---

## C. Architecture

### C.1 App Layer
- Next.js App Router
- Route groups:
  - `(public)` marketing pages
  - `(auth)` sign-in/up flow
  - `dashboard` protected area
  - `api/*` service endpoints

### C.2 Data Layer
Supabase Postgres + RLS

Tables:
1. `profiles`
2. `subscriptions`
3. `credit_accounts`
4. `credit_transactions`
5. `offer_copy_generations`
6. `webhook_events`

### C.3 Billing Layer
Creem webhook-first sync model:
- signature verify
- idempotent event processing
- plan-to-quota mapping

### C.4 AI Layer
Offer copy service:
- input validation via Zod
- deterministic response schema
- generation history persistence

---

## D. API Standards

### D.1 Unified Error Contract (mandatory)
```json
{
  "errorCode": "STRING_ENUM",
  "message": "human-readable",
  "requestId": "uuid"
}
```

### D.2 Request ID
Every API request generates/propagates `requestId`.
- Include in error responses
- Include in server logs

### D.3 Validation
All mutating endpoints must validate payload with Zod.

### D.4 Security
- Never leak secrets in response/log
- Authenticate before user data access
- User-scoped DB operations only

---

## E. Credits Correctness Rules

1. Deduct only on valid request
2. If generation fails after deduction, rollback/compensate
3. Credit transaction table must contain:
   - type: debit/credit
   - reason
   - before/after (or delta + trace)
   - requestId linkage

---

## F. History & Pagination Rules

1. Stable response shape:
   - `items`
   - `total`
   - `hasMore`
2. Safe limits:
   - default 12~16
   - bounded max
3. Delete semantics:
   - by row id
   - optionally by batch identifier (if used)

---

## G. Frontend Module Checklist

### G.1 Landing
- hero/value/pricing/faq/cta
- responsive phone/tablet/desktop

### G.2 Auth
- email/password
- OAuth extension point
- persistent session

### G.3 Dashboard
- plan status
- credits balance
- usage summary

### G.4 Billing
- checkout entry
- customer portal entry
- plan display

### G.5 Offer Copy Studio
Input:
- product
- audience
- value proposition
- tone

Output:
- headline
- subheadline
- bullets
- CTA

Actions:
- save history
- copy all
- regenerate

---

## H. Test Matrix

### H.1 Regression (minimum)
1. Auth guard works
2. Credits deduct on success
3. Credits rollback on failure
4. History pagination contract valid
5. History deletion works
6. Webhook idempotency holds

### H.2 Build Gate
- `npm run build` required

### H.3 CI Gate
- build + tests required before merge

---

## I. Delivery Phases

### Phase 1 — Foundation
- env loader
- requestId helper
- error helper
- supabase server/client/service-role split

### Phase 2 — Auth + Protected Dashboard
- auth page
- middleware route protection
- dashboard bootstrap

### Phase 3 — Credits + Billing
- schema + APIs
- billing entry endpoints
- basic sync workflow

### Phase 4 — AI Offer Copy
- API + prompt builder
- frontend form + output
- history persistence

### Phase 5 — Webhook + Idempotency
- Creem signature verify
- event dedupe
- subscription sync state machine

### Phase 6 — QA + Docs + Deploy
- regression tests
- CI workflow
- deployment runbook

---

## J. Definition of Done
Project considered complete only if:
1. all modules implemented (frontend + backend + db)
2. build passes
3. regression tests pass
4. CI config merged
5. docs complete and accurate
6. pushed to `main`

