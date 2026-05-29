# GURLY Architecture Audit Protocol

This file is the required checklist after every meaningful update. Do not treat a UI change, admin change, checkout change, or deployment as complete until this flow is reviewed.

## Protected Boundaries

- Admin routes must be protected twice:
  - Optimistic redirect in `proxy.ts` for `/admin/:path*`.
  - Authoritative role check in `app/admin/layout.tsx` through `requireAdminUser()`.
- Admin mutations must call `assertAdminUser()` before writing:
  - `app/admin/products/actions.ts`
  - `app/admin/categories/actions.ts`
  - `app/admin/orders/actions.ts`
- Checkout and payment APIs must call `getCurrentUser()` and reject anonymous requests:
  - `app/api/orders/route.ts`
  - `app/api/payment/create/route.ts`
  - `app/api/payment/verify/route.ts`

## Customer Flow

- Home renders without console errors.
- Shop lists products from the same catalog source as admin.
- Product page never assumes unsafe media shape.
- Cart persists locally but checkout totals are recalculated server-side.
- Checkout requires login before COD or Razorpay payment.
- Order creation validates stock inside a transaction.

## Admin Flow

- Anonymous `/admin` redirects to `/login?next=/admin`.
- Customer role redirects away from admin to `/account`.
- Admin dashboard selects only safe columns, not full user objects.
- Dashboard errors show an explicit failure state, not fake zero metrics.
- Admin tables must be bounded or paginated.
- Admin forms must validate input with Zod/server-side validation.

## Auth Flow

- `gurly_session` must remain HTTP-only, secure in production, and same-site.
- `getCurrentUser()` is request-memoized to avoid repeated DB reads in nested server components.
- Google auth depends on Supabase provider configuration.
- If Google provider is disabled, login must show an in-app error and must not send users to raw Supabase JSON output.

## Deployment Flow

Run these checks before pushing or deploying:

```powershell
npm run audit:system
npx tsc --noEmit
npm run build
```

Run focused browser smoke checks after deploy:

- `/admin` redirects to login when unauthenticated.
- `/checkout` redirects to login when unauthenticated.
- `/api/orders` returns `401` without a session.
- `/api/payment/create` returns `401` without a session.
- `/api/auth/google-status` returns an explicit provider status.

## Known External Configuration

- Supabase Google provider is currently external configuration. If `/api/auth/google-status` returns `enabled: false`, enable Google in Supabase Authentication Providers and allow-list:
  - `https://gurly2.vercel.app/auth/callback`
  - Local callback URL used during development.

