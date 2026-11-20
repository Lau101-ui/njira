# Security policy

## Scope

NJIRA is a marketplace that will process account data, private creator/client communications, uploaded media and payments. Security is a release requirement, not a post-launch task.

The current GitHub Pages prototype is not a production marketplace and must not collect real credentials, payment details, private briefs or customer data.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include secrets, personal data, payment details or exploit payloads in a public discussion.

Report privately through GitHub's **Report a vulnerability** flow on this repository. Include:
- affected URL, component, commit or release;
- impact and realistic attack scenario;
- minimal reproduction steps;
- any suggested mitigation.

Allow time for investigation and a fix before public disclosure. Do not test against real users, production accounts or payment systems without explicit authorization.

## Security requirements before production

- Enforce server-side authentication and authorization on every protected operation; never rely on hidden UI controls.
- Use least-privilege roles and verify resource ownership on every read/write.
- Validate and normalize all input at trust boundaries; encode output and use parameterized database access.
- Keep provider keys, auth secrets, database credentials and webhook secrets server-side and out of Git history, client bundles, logs and screenshots.
- Use HTTPS, secure/HttpOnly/SameSite cookies, CSRF protection where cookie-authenticated state changes are used, strict CORS, CSP and other security headers.
- Apply rate limits to login, signup, password recovery, checkout creation, messaging and uploads.
- Validate uploads by content, size and allowed type; use randomized object keys, private storage by default, malware scanning where feasible, and short-lived signed URLs.
- Use database constraints and transactions for financial state changes. Use idempotency keys and immutable audit records.
- Verify every PayChangu payment server-to-server before fulfilment. Verify webhook signatures against the exact provider-defined payload, persist events, process idempotently and reconcile pending transactions.
- Never store card PAN, CVV, mobile-money PINs or authentication tokens in plaintext.
- Log security-relevant events without logging passwords, tokens, secrets, payment credentials or unnecessary personal data.
- Back up the database and test restore procedures. Define retention and deletion policies.
- Run dependency, static-analysis, secret-scanning and migration checks in CI. Review and patch vulnerabilities before release.

## Release gate

No production launch until the threat model, authorization matrix, payment failure/replay tests, backup/restore test, dependency audit, secret scan, security headers, rate limits and incident-response process have been reviewed and signed off.
