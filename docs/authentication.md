# NJIRA authentication foundation

**Status:** authentication provider and server integration scaffold. It is not yet a production-ready account system.

## Provider decision

NJIRA uses Better Auth with the existing PostgreSQL/Prisma data layer. This avoids introducing a separate identity database and supports email/password sessions plus authenticator-app TOTP and recovery codes. The dependency is pinned to stable release 1.7.26 rather than a beta or release candidate.

## Implemented in this branch

- Better Auth server instance using the Prisma adapter.
- Next.js App Router handler at `/api/auth/[...all]`.
- Database models for user auth profile fields, sessions, linked accounts, verification records and TOTP recovery data.
- Email/password authentication configured with email verification required.
- TOTP two-factor plugin configured.
- Production startup fails if `BETTER_AUTH_URL` or `BETTER_AUTH_SECRET` is missing.
- Secure cookies enabled in production, session cookie cache disabled, and auth rate limiting enabled.
- Public registration is deliberately disabled until NJIRA has a real transactional email provider and a verified sender domain.

## Required deployment configuration

Set `DATABASE_URL`, `BETTER_AUTH_URL` (the canonical HTTPS origin), and a cryptographically random `BETTER_AUTH_SECRET` of at least 32 bytes in the deployment secret manager. Never commit real secrets.

Before opening registration, select and configure an email delivery provider, implement its adapter for verification and password-reset messages, configure sender-domain authentication (SPF/DKIM/DMARC), and test delivery, expiry, replay prevention and account enumeration behaviour. Do not silently disable email verification to make signup appear functional.

## Security work still required

1. Add account registration and sign-in UI only after email delivery is wired and tested.
2. Add password-reset delivery, abuse monitoring, CAPTCHA or risk-based controls where appropriate, and a documented account recovery process.
3. Add server-side session-to-NJIRA-user resolution and enforce `User.status` on every protected request.
4. Enforce TOTP for all privileged staff sessions. Enabling the plugin alone does not enforce staff MFA; privileged routes must deny staff sessions without a verified second factor.
5. Implement staff role checks from database assignments, resource-level ownership checks, CSRF/origin protections, audit logging and tests.
6. Generate and review a Prisma migration against a disposable PostgreSQL database. Do not apply a migration to production from this branch.
7. Configure a production secret manager, HTTPS, trusted origins, email provider and security monitoring before deployment.

The existing `authProvider` and `authSubject` fields are now nullable compatibility fields. Better Auth's `Account` records hold linked provider identities; application authorization must use the authenticated local NJIRA user ID, never a browser-supplied subject or role.
