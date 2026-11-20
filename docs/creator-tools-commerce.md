# NJIRA Tools — digital creator services commerce

## Product boundary

NJIRA Tools is a focused catalogue for software, AI services and creator infrastructure that help people make, publish and run creative work. It is not a general entertainment-subscription shop.

Initial categories:
- Editing, design, photography and audio software.
- AI tools for image, video, writing, voice and workflow.
- Creator infrastructure: domains, hosting, portfolio tools, cloud storage and professional email.
- Business tools used by freelancers and studios.

A product appearing in a draft catalogue is not an assertion that NJIRA can currently sell it. Only publish a plan after the vendor's regional availability, payment route, licence terms, fulfilment method and refund path have been verified.

## Customer journey

1. Customer selects a tool and a specific plan/term.
2. Server loads the active plan and confirms that the tool is active, available in the customer's country, and backed by an active supplier/approved fulfilment route.
3. Server creates a pending DigitalServiceOrder and an associated Payment with purpose DIGITAL_TOOL_PURCHASE. Amount and currency come from the database, never the browser.
4. Customer pays using the supported NJIRA checkout method.
5. A browser return is informational only. Payment is marked successful only after server-side PayChangu verification matches the stored transaction reference, amount and currency.
6. After verified payment, a durable fulfilment job is queued. Fulfilment is idempotent and tied to the order.
7. Customer receives delivery instructions and order status. Failures enter a support/reconciliation queue; they are not silently marked fulfilled.

## Fulfilment models

- **Authorised reseller:** Preferred for recurring software subscriptions where vendor terms support reseller distribution. Retain the agreement reference and supplier operational contact.
- **Redemption code:** Use only genuine codes sold for the customer's account region and product edition. Verify region, expiry, currency and redemption restrictions before publication.
- **Direct vendor checkout assist:** Only where the vendor's terms and a documented customer-authorised workflow permit it. Never collect a customer's vendor password, OTP, payment card or recovery code.
- **Manual approved fulfilment:** A controlled operational fallback with two-person review, supplier evidence and an auditable status trail. Do not use staff personal accounts/cards as an undocumented fulfilment system.

The schema stores a vault reference rather than secrets or raw codes. Actual secret delivery must use a dedicated encrypted secret store and one-time, access-controlled delivery flow. Do not put credentials in logs, ordinary database text fields, email notifications or analytics.

## Pricing and currency

- Customer-facing price and currency are fixed on the selected plan and snapshotted onto the order.
- Initial payment currencies remain MWK and USD only, subject to provider account and sandbox confirmation.
- Supplier cost and supplier-cost currency are recorded separately from customer price.
- Do not add unlike currencies together or calculate margin without an actual FX rate and recorded conversion transaction.
- Any displayed FX equivalent is informational and must not change the checkout amount.
- Show the full price, term, renewal behaviour, taxes/fees if applicable, region restrictions and delivery expectation before checkout.
- For recurring plans, state clearly whether NJIRA can renew automatically. Do not promise auto-renewal unless the supplier and payment rails support it and a compliant recurring-payment mandate exists.

## Catalogue publication gates

A plan can be activated only after an operator has confirmed:
- Supplier identity, contract/authorisation or legitimate wholesale source.
- Product is available for Malawi and the customer's intended account region.
- Plan name, term, exact entitlement and device/user limits.
- Whether it is a new subscription, renewal, top-up or redemption code.
- Supplier cost, customer price, currency and margin.
- Delivery SLA, outage/failure path and support contact.
- Cancellation, refund, expiry and chargeback handling.
- Vendor terms permit the intended resale/transfer/activation model.
- Test purchase and fulfilment have succeeded in a non-production environment.

Never market shared accounts, cracked software, account rentals, region-mismatched codes, education licences sold to ineligible buyers, or "lifetime" access where the vendor only grants a time-limited subscription.

## Payment and ledger controls

- Digital service orders are a separate commerce domain from creator-service commissions and client project orders.
- A payment must reference exactly one subject: a normal order, a proposal application, or a digital-service order. Enforce this in the payment service and add database-level checks in a later migration.
- Store expected amount, currency, purpose, and idempotency key before checkout.
- Verify PayChangu server-to-server; never trust return URLs or browser-submitted status.
- Webhook replay, duplicate checkout attempts and repeated fulfilment callbacks must not create duplicate sales, supplier orders or ledger entries.
- Keep buyer collection, provider fee, supplier payable/cost, NJIRA gross margin, refund and chargeback movements separate.
- Do not treat customer payment as supplier payment or mark an order fulfilled just because it is paid.
- Record the external supplier reference and a durable fulfilment status trail.

## Launch strategy

Start with a small, verified catalogue rather than dozens of unverified logos. Suggested discovery candidates (not launch promises): creator editing/design tools, selected AI services, domains and hosting. Each candidate needs a country/region and fulfilment check before being listed.

The initial build adds the domain model and operational rules only. It does not yet provide a live supplier integration, fulfilment automation, subscription renewal engine, or production checkout UI.


## Commercial model

Use the proposed fee policy in [revenue-model-and-launch-fees.md](./revenue-model-and-launch-fees.md) when designing checkout, order snapshots and ledger postings. Tool prices must be approved per SKU from verified supplier and cost-to-serve data; a simple retail-minus-supplier spread is not net profit. Do not activate a plan until its contribution margin and fulfilment route are validated.
