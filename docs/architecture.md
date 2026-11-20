# NJIRA application architecture

## Product boundary

NJIRA is a two-sided creative marketplace and ecosystem, not just a directory. It must support clients buying defined services/products and commissioning custom creative work. The Malawi-first launch uses MWK as its default currency while keeping currency and country explicit in records.

The current root `index.html` remains the visual prototype. Do not bolt production credentials, payment logic, or user data onto the static GitHub Pages site. The production application needs a server runtime and a database.

## Proposed application stack

- **Web application:** Next.js App Router + TypeScript. Migrate the approved visual system in controlled components; do not redesign it during the migration.
- **Database:** PostgreSQL.
- **Data access:** Prisma ORM and migrations.
- **Authentication:** managed authentication provider with server-verified sessions. Keep the app's internal `User` ID stable and map the provider's subject to it; do not couple marketplace records to a specific auth vendor.
- **Media:** object storage with signed upload/download URLs. Never store uploaded binaries in PostgreSQL or trust client-supplied file URLs.
- **Payments:** PayChangu Standard Checkout for buyer collection, with a server-side adapter. Treat PayChangu Connect / creator disbursement as a separate capability requiring merchant/product approval and a validated settlement model.
- **Deployment:** a Node-capable host for the web/API runtime and managed PostgreSQL. GitHub Pages is only for the current prototype.

These are architecture decisions to validate during the application bootstrap, not a claim that the production stack is already deployed.

## Core bounded contexts

1. **Identity:** users, role membership, creator/client profiles, verification and account status.
2. **Discovery:** creator profiles, categories, services, physical/digital products, tags and search.
3. **Commerce:** carts/orders, immutable order-line snapshots, payment attempts and refunds.
4. **Projects:** client briefs, proposals, milestones, deliverables and project conversations.
5. **Trust:** reviews, moderation, reports and audit history.
6. **Money movement:** payment verification, platform ledger, creator settlement/payout records and reconciliation.
7. **Operations:** admin actions, webhook event inbox, email notifications and background jobs.

## Domain rules

- A user can be both a creator and a client. Roles are capabilities, not mutually exclusive account types.
- Every amount is stored as an exact decimal plus ISO currency code. Do not use floating-point arithmetic for money.
- Prices, titles, descriptions, creator identity and tax/fee assumptions are snapshotted onto order items when an order is placed. Later listing edits must not rewrite past purchases.
- An order is not paid because a browser returned to a success page. Only server-side verification of the matching PayChangu transaction may mark it paid.
- A payment attempt belongs to one order and has a unique NJIRA transaction reference. Multiple attempts may exist for an order, but only one successful collection should settle the payable amount.
- Webhook deliveries are stored before processing and handled idempotently. Repeated events must not duplicate order settlement or ledger entries.
- Keep gross buyer payment, provider fees, NJIRA commission, refunds and creator payable amounts as separate ledger movements.
- Do not promise creator payouts until PayChangu's marketplace / Connect arrangement, fees, eligibility, KYC, settlement timing and refund/chargeback responsibilities are confirmed.
- Store provider IDs and minimal transaction metadata; never store card PAN, CVV, mobile-money PINs, API secrets or raw authentication credentials.

## First production milestones

1. Bootstrap the Next.js/TypeScript app in a new application directory or migration branch; preserve the current static prototype until the replacement passes QA.
2. Provision PostgreSQL and run Prisma migrations in development/staging.
3. Integrate managed auth and map verified sessions to internal users.
4. Implement creator/client profiles, listings and media upload.
5. Implement briefs, proposals, milestones and messaging.
6. Implement orders and PayChangu buyer collection in sandbox.
7. Add verified webhook processing, reconciliation, refunds and audit trails.
8. Validate creator settlement with PayChangu before enabling payouts or commission splits.
9. Complete security, accessibility, performance and mobile QA before production launch.

## Explicitly not production-ready

The existing `index.html` is a static design prototype. This schema and the PayChangu notes are an initial engineering foundation; they are not a deployed backend, a legal/compliance review, or a live payment integration.
