# PayChangu integration plan

Official references consulted:
- [Developer introduction](https://developer.paychangu.com/docs/introduction)
- [Standard Checkout](https://developer.paychangu.com/docs/standard-checkout)
- [Transaction verification](https://developer.paychangu.com/docs/transaction-verification)
- [Webhooks](https://developer.paychangu.com/docs/webhooks)
- [PayChangu Connect](https://developer.paychangu.com/docs/paychangu-connect)

Re-check the live documentation before implementation because provider endpoints, payloads and product availability can change.

## Phase 1: buyer collection (Standard Checkout)

Use Standard Checkout first. It redirects the buyer to PayChangu-hosted checkout and supports the documented MWK and USD currencies. This avoids handling sensitive card/mobile-money credentials in NJIRA's frontend.

1. The authenticated buyer requests checkout for an order.
2. The server loads the order and calculates the payable total from trusted database prices and stored fee rules. Never accept the amount/currency from the browser as authoritative.
3. The server creates a unique, unpredictable `tx_ref`, inserts a pending `Payment` record and calls `POST https://api.paychangu.com/payment` with the secret key in the Authorization Bearer header.
4. Send the server-owned amount, currency, `tx_ref`, customer details, callback URL and return URL. Keep the secret key exclusively in server environment variables.
5. Validate the provider response and redirect the buyer to its returned `checkout_url`.
6. The return/callback route is informational only. It must not mark an order paid.
7. On webhook delivery, verify the SHA-256 HMAC signature over the exact raw request body using the webhook secret and constant-time comparison. Persist the event and acknowledge valid deliveries with HTTP 200.
8. Re-query PayChangu using its server-side transaction verification endpoint. Compare the verified `tx_ref`, status, currency and amount against the stored payment/order before settlement.
9. In one database transaction, lock/update the payment and order idempotently, create ledger entries exactly once, and enqueue confirmation/fulfilment.
10. Run a scheduled reconciliation job for pending payments because webhooks can fail or be delayed. Do not rely only on webhooks.

## Payment state model

- `PENDING`: checkout created; awaiting authoritative provider result.
- `SUCCEEDED`: provider verification confirms exact reference, successful status, currency and sufficient amount.
- `FAILED`: provider confirms failure.
- `CANCELLED`: buyer/provider cancellation confirmed.
- `EXPIRED`: pending attempt passed its expiry/reconciliation policy.
- `REFUNDED` / `PARTIALLY_REFUNDED`: only after a refund is confirmed and recorded.

Do not treat a browser query parameter such as `status=success` as proof. Do not downgrade a succeeded payment because a delayed failed webhook arrives. Record conflicting events for review.

## Webhook security and idempotency

- Read and retain the raw request bytes before JSON parsing; HMAC must be computed over the exact payload.
- Compare the calculated digest to the provider's `Signature` header with a timing-safe comparison.
- Reject invalid signatures. Do not log secrets or full sensitive payloads.
- Persist a provider event ID if available; otherwise derive a stable deduplication key from provider, reference, event type and payload digest.
- Make processing retry-safe. A duplicate webhook must never create a second ledger movement or fulfilment.
- A valid webhook is a notification, not the source of truth: always call transaction verification before releasing value.
- If provider verification is unavailable, leave the payment pending and retry; do not guess.

## Marketplace settlement is a separate decision

A successful Standard Checkout collection sends money to the NJIRA merchant account. That alone does not automatically split funds or pay individual creators.

PayChangu's Connect documentation describes a creator authorization flow and commission capability. Before implementing creator payouts, NJIRA must confirm with PayChangu:
- whether Connect is available and approved for NJIRA's business model and account;
- whether creators must each hold/verify a PayChangu merchant account;
- whether split settlement and platform commission work for the exact Malawi and currency use cases;
- who bears provider fees, refunds, disputes and chargebacks;
- payout timing, limits, reversals, KYC/AML requirements and reconciliation reports.

Until confirmed, use a transparent manual/controlled settlement workflow with ledger tracking, not an invented automatic split. Never label a creator as paid until the payout is independently confirmed.

## Environment variables (server only)

- `PAYCHANGU_SECRET_KEY`
- `PAYCHANGU_WEBHOOK_SECRET`
- `PAYCHANGU_API_BASE_URL` (default `https://api.paychangu.com`)
- `APP_BASE_URL`
- `DATABASE_URL`

Use sandbox/test credentials and a publicly reachable staging webhook for end-to-end testing. Never commit real keys, test keys, webhook secrets or customer data.
