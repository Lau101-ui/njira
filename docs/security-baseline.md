# NJIRA security baseline and threat model

## Assets to protect

1. User identity, email addresses, sessions and recovery flows.
2. Creator/client profiles, unpublished briefs, proposals, messages and deliverables.
3. Listing ownership, prices, inventory and order history.
4. Payment references, payment state, commission calculations and creator payable balances.
5. Uploaded files, private media and signed URLs.
6. Admin/moderation actions, audit records, environment secrets and backups.

## Trust boundaries

- Browser ↔ application server: all browser input is untrusted, including IDs, prices, roles, return URLs and payment status.
- Application server ↔ PostgreSQL: use a least-privilege DB account, migrations reviewed separately, and transaction boundaries for money state.
- Application server ↔ PayChangu: authenticate outbound calls with server-only secrets; validate response shape and transaction fields.
- PayChangu ↔ webhook endpoint: verify provider signature before trusting event content; then re-query the transaction.
- Application server ↔ object storage: private-by-default storage, scoped signed uploads/downloads, strict size/type limits.
- Admin ↔ platform: require stronger authentication, least privilege, audit logging and explicit authorization.

## Primary threats and required controls

| Threat | Required controls |
|---|---|
| IDOR / cross-account data access | Ownership checks and policy checks in server-side service layer for every resource access; negative tests across two users |
| Forged roles or client-supplied prices | Derive role, owner, price, currency, fees and order state from trusted database records |
| Session theft / account takeover | Managed auth, secure cookies, MFA for administrators, rate limits, recovery controls and session revocation |
| CSRF / XSS | CSRF defenses for cookie-authenticated writes, output encoding, input validation, CSP and secure headers |
| SQL injection | Prisma parameterized queries; prohibit raw SQL unless reviewed and parameterized |
| Malicious uploads | File signature/content validation, size caps, random object keys, isolated private storage and scanning |
| Payment spoofing / replay | Server-side verification, exact transaction matching, webhook HMAC, deduplication, DB transactions and reconciliation |
| Duplicate checkout / race conditions | Unique transaction refs, idempotency keys, row-level locking or conditional updates and unique ledger references |
| Privilege escalation | Explicit policy layer, no role assignment from client input, audited admin actions |
| Secret leakage / dependency compromise | Secret scanning, lockfile, dependency review, Dependabot, pinned CI actions and restricted CI permissions |
| Data loss / insider error | Automated backups, restore drills, immutable audit trail and least-privilege production access |

## Authorization model

Users may act as both creators and clients. Account roles are not sufficient authorization by themselves. Every action must check:
- the authenticated internal user ID;
- the relevant resource's owner/participant relationship;
- the resource's current state and allowed transition;
- whether the requested operation is permitted for that relationship.

A creator must not read another creator's private drafts or proposals. A client must not read another client's brief or order. Conversation access must require explicit participant membership. Admin access must be separate, minimal and auditable.

## Financial invariants

- The server computes totals from persisted listing/order data.
- Money uses exact decimal/integer arithmetic and an explicit ISO currency code.
- Currency-specific amount rules are validated before checkout; PayChangu Standard Checkout documents integer amount values.
- A successful return URL is not payment proof.
- Only a verified PayChangu transaction with matching transaction reference, successful status, currency and amount can settle an order.
- Webhook delivery is at-least-once; processing must be idempotent.
- Payment status, order status and ledger postings change atomically.
- Creator balances are derived from immutable ledger entries, not editable profile fields.
- Payouts remain disabled until PayChangu Connect / settlement terms and operational controls are confirmed.

## CI and release gates

- Validate Prisma schema on every pull request.
- Run type checking, unit/integration tests and production build once the app scaffold exists.
- Run CodeQL and dependency review.
- Scan commits for secrets; configure GitHub secret scanning/push protection where available.
- Require review for schema, auth, payment, deployment and workflow changes.
- Protect the production branch; require passing checks and prohibit force pushes.
- Keep staging separate from production and use PayChangu test credentials for integration tests.
- Conduct a pre-launch security review and restore drill.

## Known limitations right now

This branch contains the prototype plus initial schema/payment groundwork. There is not yet an application server, real authentication, database deployment, authorization middleware, object storage, webhook route, reconciliation worker, tests or production controls. The presence of a Prisma model or helper module does not make these workflows secure until they are wired, tested and reviewed end-to-end.
