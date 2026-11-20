# Supplier onboarding and launch checklist

Use one checklist per supplier and per product/plan. A supplier being approved does not automatically approve every product it offers.

## Supplier verification
- [ ] Legal/business identity and contact verified.
- [ ] Supplier source and ownership of stock/codes verified.
- [ ] Written reseller/distribution permission or documented legitimate procurement route.
- [ ] Contract/agreement reference stored; expiry and renewal dates tracked.
- [ ] Settlement method, currency, fees and payout timing confirmed.
- [ ] Support escalation contact and service-level expectations recorded.

## Product and regional eligibility
- [ ] NJIRA's legal role for this product (seller/reseller, agent or marketplace intermediary) documented and approved.
- [ ] Malawi counsel or designated compliance owner has confirmed required licence/authorisation and applicable consumer obligations.
- [ ] Resale, sublicensing, code distribution and trademark/marketing rights are expressly permitted in writing.
- [ ] Seller-of-record, tax invoice issuer, customer support owner and refund/chargeback responsibility are explicit.
- [ ] Applicable withdrawal/cooling-off exceptions and any required express early-performance consent have been reviewed; no blanket statutory-rights waiver is used.

- [ ] Product and exact plan/edition identified.
- [ ] Malawi availability confirmed by vendor/supplier.
- [ ] Customer account country/region restrictions understood.
- [ ] Device, seat, usage and eligibility restrictions disclosed.
- [ ] Auto-renewal, prepaid term, cancellation and refund behaviour documented.
- [ ] Vendor terms permit the fulfilment and resale method.
- [ ] No shared credentials, account rental, cracked licence or bypass.

## Economics
- [ ] Supplier cost and currency verified.
- [ ] NJIRA retail price and currency approved.
- [ ] FX risk and conversion costs documented where currencies differ.
- [ ] Provider fees, taxes and refund/chargeback exposure modelled.
- [ ] Gross margin positive after realistic support and failure costs.

## Fulfilment and support
- [ ] Test order completed successfully.
- [ ] Delivery SLA and retry strategy defined.
- [ ] Duplicate fulfilment/idempotency tested.
- [ ] Secret/code delivery uses encrypted, access-controlled storage.
- [ ] No vendor password, OTP, card number or PIN is requested from customers.
- [ ] Failure, refund, expiry and supplier outage playbooks documented.
- [ ] Customer receipt explains the exact entitlement and term.

## Go-live approval
- [ ] Supplier status set ACTIVE by authorised operator.
- [ ] Product status set ACTIVE only after all checks pass.
- [ ] Plan isActive enabled only after plan-specific approval.
- [ ] Support and finance owners assigned.
- [ ] Monitoring and reconciliation are enabled.


## Application workflow and evidence handling

The current Prisma schema includes `SupplierApplication` and append-only
`SupplierApplicationReviewEvent` records. This is a data contract, not a live
supplier portal or approval process.

### Applicant submission
- [ ] Applicant is authenticated and can access only their own draft/application.
- [ ] Legal business name, operating country, registration/tax details and business address are collected only where necessary.
- [ ] Contact person and verified business contact channels are recorded.
- [ ] Products/brands, source of supply, reseller/distribution authority and target countries are declared.
- [ ] Regional restrictions, proposed fulfilment, settlement currencies, refunds and support process are documented.
- [ ] Evidence is uploaded to a private encrypted document store; the database stores opaque evidence references only.
- [ ] Applicant confirms that information is accurate and that NJIRA may verify it.
- [ ] Submission freezes the submitted snapshot; later changes are versioned/audited.

### Internal review
- [ ] Only an authenticated, authorised compliance/operations reviewer can read evidence or change application status.
- [ ] Reviewer verifies the legal entity and contact independently using authoritative sources where available.
- [ ] Reviewer checks ownership/source of products and the exact scope/territory/term of resale authority.
- [ ] Reviewer checks each product, country, plan, delivery method and refund route separately.
- [ ] Reviewer records a reason code and concise decision note for every state change.
- [ ] Requests for information return the application to the applicant without granting catalogue or fulfilment access.
- [ ] Approval creates or links a supplier record but does not automatically activate any product or plan.
- [ ] A separate product/plan launch review is required before publication or sale.
- [ ] Rejected applications retain a reasoned audit record and can be resubmitted only through a controlled process.

### Security and retention
- [ ] Do not store identity documents, bank statements, tax certificates, API secrets or full contracts in ordinary database text fields.
- [ ] Evidence references must be non-guessable and access-checked on every read.
- [ ] Record privileged evidence access and every decision event.
- [ ] Define retention and deletion periods with counsel; preserve records only as long as justified.
- [ ] Do not expose internal notes, reviewer identities, evidence references or supplier costs through public catalogue APIs.

**Implementation boundary:** schema models have been added, but no supplier application API, upload vault, staff authentication/RBAC, review UI, migration or end-to-end tests exist yet. Do not accept real supplier applications until those controls are implemented and reviewed.
