# NJIRA authentication and onboarding

**Status:** application-level authentication flows are implemented in the feature branch. They are not production-ready until secrets, email delivery, database migration and deployed end-to-end tests are completed.

## Provider choices

- Better Auth manages password authentication, sessions, email verification, password resets and TOTP.
- Resend is the transactional email transport. It is replaceable and is not an identity provider.
- PostgreSQL/Prisma remains the source of NJIRA account and profile records.

## Implemented

- Sign-up and sign-in screens with creator/client intent selection.
- Email verification required before sign-in; verification links expire after one hour.
- Password reset email and reset-token screen. Password resets revoke active sessions.
- Password minimum of 12 characters and maximum of 128.
- Sign-up remains disabled unless both `RESEND_API_KEY` and `AUTH_EMAIL_FROM` are present.
- Resend email templates escape HTML and do not log email addresses, verification URLs, reset tokens or provider responses.
- Creator/client onboarding writes to the corresponding Prisma profile table only after server-side session and active-account checks.
- Onboarding validates same-origin requests, profile fields and creator handle uniqueness.
- Account page checks the authenticated session and current user status.
- TOTP is configured, but staff-route MFA enforcement is not yet implemented.

## Required configuration

Set these values in the hosting provider's secret manager, not in Git:

- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_URL`: canonical HTTPS origin, with no path.
- `BETTER_AUTH_SECRET`: cryptographically random secret of at least 32 bytes.
- `RESEND_API_KEY`: Resend sending-only API key, ideally restricted to the NJIRA sender domain.
- `AUTH_EMAIL_FROM`: verified sender, e.g. `NJIRA <accounts@yourdomain.com>`.

Verify a domain you control in Resend and configure its required DNS records before using that domain in `AUTH_EMAIL_FROM`. The provider's onboarding sender is for testing only, not production NJIRA users. Never commit API keys or paste them into chat.

## Activation sequence

1. Create a Resend account and verify a NJIRA-owned sending domain.
2. Create a sending-only API key restricted to that domain.
3. Add the environment variables to the deployment secret manager.
4. Generate and review a Prisma migration against a disposable PostgreSQL database.
5. Deploy to staging and test sign-up, email verification, sign-in, resend verification, password reset, session revocation, creator onboarding, client onboarding and invalid/expired tokens.
6. Test deliverability to common providers and monitor bounces, complaints and delivery failures.
7. Only then enable public registration and announce account creation.

## Launch gates

- No production database migration has been applied from this branch.
- No live Resend account, sender domain, DNS records or API key has been configured by this code change.
- Email dispatch is asynchronous to reduce account-existence timing differences. Confirm the hosting runtime reliably completes sends; use its supported background-task primitive if required.
- TOTP is configured, but privileged staff routes still need mandatory MFA enforcement.
- Staff role enforcement, abuse monitoring, privacy notices, legal acceptance capture and full security testing remain required.
- Do not enable payments, supplier fulfilment or creator payouts merely because account registration becomes available.
