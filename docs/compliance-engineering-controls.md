# NJIRA compliance engineering controls

**Status:** database contract and implementation requirements. These controls are not yet wired into a running application. The current repository is still a static HTML prototype plus server-side PayChangu adapter and Prisma domain model. Do not claim that privacy rights, consent, jurisdiction gating, refunds or legal acceptance are operational until API, UI, authentication, authorisation, migrations, monitoring and tests exist.

## Data model now present

The Prisma schema includes:
- `LegalDocumentVersion`: immutable, versioned policy/agreement metadata and SHA-256 content hash.
- `LegalAcceptance`: records the exact document version, user, timestamp and acceptance context.
- `ConsentEvent`: append-only granular optional consent grants/withdrawals.
- `DataSubjectRequest`: tracked access, correction, erasure, portability, restriction, objection, consent withdrawal and complaint cases.
- `ComplianceIncident`: security/privacy incident register with detection, awareness, containment and notification timestamps.
- `JurisdictionFeatureApproval`: country + feature approval gate.
- Order snapshots for seller-of-record, seller role, terms version and privacy notice version; digital orders also have an explicit digital-content early-delivery consent timestamp/version.

These are schema-level records only. No production migration has been generated or applied.

## Required application behaviour

### Policy publication and acceptance
1. Only a `PUBLISHED` LegalDocumentVersion whose `effectiveAt` has passed may be accepted for a new transaction.
2. Publishing a changed policy creates a new version and content hash. Never overwrite the content or hash of a published version.
3. At account creation and before checkout/contract formation, show the relevant terms and privacy notice. Store acceptance against the exact version.
4. Acceptance of terms/privacy is not consent to marketing, analytics, profiling or non-essential cookies. Use separate, optional, granular `ConsentEvent` records.
5. Do not pre-tick optional consent. Make withdrawal as easy as grant. A withdrawal appends a `WITHDRAWN` event and stops the relevant future processing.
6. If a user has not accepted the current mandatory terms, stop the relevant contract flow and show the new terms; do not silently record acceptance.
7. A legal acceptance record must be tamper-evident and access-controlled. Avoid collecting raw IP addresses. If an IP-derived identifier is genuinely necessary, use a keyed HMAC with rotation and documented retention, not an ordinary unsalted hash.

### Digital-content withdrawal and early performance
1. Do not assume every digital product is exempt from statutory withdrawal rights.
2. Determine the legal treatment for the exact product, consumer/business status, jurisdiction and contract.
3. Where lawful and required, present a separate unticked, explicit request for early supply/performance and the legally required acknowledgement of any effect on withdrawal rights.
4. Store the exact consent text/version, timestamp and order reference before beginning the relevant supply.
5. If the required consent is absent, do not start early delivery where the law requires consent.
6. Do not use the consent record to waive remedies for faulty, misdescribed, undelivered or non-conforming products.

### Privacy request workflow
- Verify identity proportionately; do not request national ID by default.
- Create a case, calculate the applicable deadline from current law, record the lawful basis for any refusal or retention exception, and provide a response through a secure channel.
- Erasure must propagate to processors where required. If records must be retained for tax, fraud, legal claims or statutory accounting, restrict access and processing and record a reasoned legal hold.
- Do not delete financial ledgers or transaction evidence automatically without assessing statutory retention and legal-claims requirements.
- Export only the requesting person's data and avoid exposing other users' messages or personal data.
- The `subjectReferenceHash` must be a keyed HMAC or equivalent pseudonymous identifier, not a plain hash of email/phone. Keep identity evidence in a separate encrypted case store.

### Jurisdiction feature gate
- Resolve the applicable country from a defensible source and explain any country determination to the user where relevant.
- Every regulated or market-specific feature (checkout currency, creator payouts, tool sale, paid placement, data transfer, etc.) must check `JurisdictionFeatureApproval`.
- Missing, `PENDING` or `BLOCKED` approval must deny the feature (fail closed).
- Only a designated compliance role may approve a country/feature combination. Record reviewer, review reference, approval time and next review date.
- Re-check approval when laws, payment providers, supplier terms or product scope change. Do not infer that approval for Malawi also approves another country.

### Incident response
- Start the statutory notification clock from the legally relevant awareness point, not merely when an incident is closed.
- Preserve evidence, contain the incident, assess scope and risk, record the decision and notify the DPA and affected people where required by the current Act/regulations/guidance.
- The incident table is a register, not an incident-response system. Add restricted access, evidence storage, escalation paging, decision approvals and a tested response playbook.
- Never put passwords, API keys, card data, OTPs, full identity documents or unnecessary user data in incident summaries or application logs.

### Security and access control
- All policy publication, acceptance lookup, privacy-request access, incident access and country approvals require server-side role checks.
- Use least privilege and MFA for privileged staff; log privileged reads and changes.
- Encrypt data in transit and at rest; keep keys/secrets in a managed secret store.
- Apply retention schedules and deletion jobs per data category, including backups and processor copies where technically and legally possible.
- Add audit events for policy publication, acceptance, consent changes, request decisions, legal holds, jurisdiction approvals and incident notifications.
- Protect against IDOR, CSRF, replay, account takeover and privilege escalation. Never trust client-supplied user IDs, country approvals, legal-version IDs or timestamps.

## Required test cases before release

- Cannot accept a draft, retired or not-yet-effective policy version.
- Published policy content/hash cannot be edited in place.
- User A cannot read, export, modify or delete User B's privacy request or data.
- Marketing/analytics consent is independent from account creation and checkout.
- Withdrawal stops future optional processing and is auditable.
- Early digital fulfilment is blocked until required explicit consent exists.
- Statutory withdrawal/refund rules are not bypassed by a blanket digital-goods policy.
- Missing/pending country approval denies the feature.
- Non-compliance staff cannot approve jurisdictions or access restricted incident evidence.
- Erasure requests preserve only data that has a documented lawful retention basis.
- Processor deletion/export actions are tracked.
- Incident notification assessment is recorded with awareness and decision timestamps.
- Every order retains the exact terms/privacy/seller-role snapshots used at purchase.

## Legal-status verification caveat

The DPA's official downloads currently expose the Data Protection Act and several regulatory materials. A separately surfaced page labels a 2025 registration-regulations document as "Draft 1". Do not assume a draft is binding law. Before launch, obtain the final Gazette instruments and verify their commencement and current status directly with the DPA or Malawi counsel. The Act itself and its commencement notice should be distinguished from regulations, consultation drafts and public notices.

## Next engineering sequence

1. Create and review the first SQL migration from the Prisma schema; do not apply it to production.
2. Introduce a maintained application runtime, authentication and role-based access control.
3. Implement policy-version publication and acceptance service with server-only APIs.
4. Implement granular consent capture and withdrawal.
5. Implement privacy-request and incident case workflows with secure evidence storage.
6. Implement jurisdiction gate middleware and admin approval screens.
7. Add legal snapshots and early-delivery consent to checkout/fulfilment.
8. Add automated tests listed above, security review and external legal review.
