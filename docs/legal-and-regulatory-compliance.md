# NJIRA legal and regulatory compliance baseline

**Status:** engineering and operations control baseline, reviewed against publicly available materials on 20 November 2026. **This is not a legal opinion or a certification of compliance.** A Malawi-qualified lawyer and tax adviser must review the actual company structure, contracts, payment flow, tax position and launch jurisdictions before public launch. Laws, commencement notices, regulator directions and thresholds must be rechecked at launch and whenever NJIRA enters a new market.

## 1. Product and jurisdiction boundary

NJIRA is intended to operate from Malawi and initially serve Malawian users, while potentially connecting clients and creatives abroad. That does not mean one law governs every transaction. Apply:
- Malawi law to the Malawi company, operations, local users, local payments, local creators and relevant local supplies.
- Mandatory consumer, privacy, tax, sanctions, intellectual-property and other rules in each foreign country where NJIRA actively targets customers, establishes operations, or otherwise falls within that country's territorial scope.
- Contractual rules of payment providers, app stores, software vendors, cloud providers and suppliers in addition to statutory law.

Maintain a **jurisdiction register** before enabling a new country: countries served; customer types; local consumer disclosures; privacy law and transfer mechanism; tax/VAT/GST; payment and FX restrictions; sanctions/export controls; IP notice process; mandatory language/currency requirements; local representative/registration requirements; and counsel approval.

Do not advertise NJIRA as "compliant worldwide". There is no single worldwide e-commerce licence or one international law that automatically covers every country.

## 2. Malawi legal framework to operationalise

The following instruments are relevant to NJIRA's proposed activities. Confirm current consolidated text, subsidiary regulations and commencement notices with counsel.

### Data protection and privacy
- **Data Protection Act, 2024 (Act No. 3 of 2024)**, commenced 3 June 2024 by Government Notice No. 40 of 2024.
- Data Protection Authority (DPA) guidance, registration requirements and regulatory materials. The DPA's official downloads list registration and data-processors-engagement materials, while a separately surfaced registration-regulations page is labelled Draft 1. Verify the final Gazette text, commencement and current status directly with the DPA or Malawi counsel; do not treat consultation drafts as binding regulations.
- The Act applies to processing in Malawi and can also apply to an overseas operator processing personal data of people in Malawi when offering goods/services or monitoring behaviour in Malawi.

Required controls:
- Identify NJIRA's controller/processor roles per processing activity; document lawful basis and purpose.
- Give a clear privacy notice at collection: controller identity/contact, purpose and lawful basis, retention period where possible, data-subject rights, complaint route, automated decision-making and intended overseas transfers.
- Minimise data; set retention/deletion schedules; support access, correction, portability, erasure, restriction and objection requests where applicable.
- Use processor agreements with hosting, analytics, messaging, identity, support and payment vendors; assess their security, sub-processors, locations and deletion/return terms.
- Keep a processing-activities register, access controls, encryption, secrets management, audit logs, incident response and a breach register.
- Assess whether NJIRA is a controller/processor of significant importance and whether registration is required. DPA's 2025 public notice identifies processing personal data of more than 10,000 Malawi-resident data subjects or data of great significance as relevant criteria. Do not wait until the threshold is reached to establish controls.
- Complete a Data Protection Impact Assessment before high-risk processing, profiling, large-scale sensitive data, systematic monitoring or materially new uses.
- Do not collect national IDs, biometrics, precise location, financial credentials or sensitive personal data unless demonstrably necessary and legally justified.
- For transfers outside Malawi, document the lawful transfer route and ensure the recipient provides an adequate level of protection or a statutory condition applies. Record the basis for each transfer; do not assume a foreign cloud vendor is automatically permitted.

### Electronic commerce, contracts and cyber security
- **Electronic Transactions and Cyber Security Act, 2016 (Act No. 33 of 2016)**, commenced 1 June 2017.
- The Act recognises electronic transactions and contains online supplier information, consumer-contract, cooling-off, order-performance and cybercrime provisions.

Required controls:
- Before checkout, show the supplier's legal identity and contact details, full price and currency, material product/service characteristics, delivery/activation timing, payment method, after-sales support, cancellation/refund/withdrawal conditions, warranty if applicable, dispute route, and privacy/payment-security information.
- Provide a final order review that lets the customer detect and correct errors before placing the order. Send an electronic acknowledgement within the statutory period and retain an accessible transaction record.
- State when the contract is formed, which party supplies the product/service, who handles support and refunds, and whether NJIRA acts as marketplace intermediary, seller/reseller, agent or service provider. The real operational arrangement must match the contract and marketing.
- Build the statutory electronic-contract withdrawal/cooling-off rules into the returns workflow. The Act provides a seven-day withdrawal rule for relevant distance contracts, with exceptions including certain software, recordings and services begun with the consumer's consent. Do not use a blanket "no refunds on digital products" clause; determine the exact product, consent, commencement and statutory exception, and preserve any non-excludable rights.
- The Act also contains delivery/performance and reimbursement timeframes. Configure fulfilment promises and refund workflows to meet the applicable statutory rule, not only NJIRA's preferred SLA.
- Retain electronic contracts and transaction records for the legally required period; the Act specifies a seven-year retention rule for certain electronic contracts above the prescribed value threshold. Counsel must confirm the applicable threshold and retention schedule.
- Maintain security controls against unauthorised access, account takeover, payment fraud, malicious uploads, data breaches and cyber offences. Have an incident response and evidence-preservation process.

### Consumer protection and fair trading
- **Consumer Protection Act, 2003**: consumer rights include clear, sufficient and timely information about price, characteristics, quality and risks, fair treatment and remedies.
- **Competition and Fair Trading Act, 2024 (Act No. 20 of 2024)**: enacted, but the public legal source checked for this baseline labels it uncommenced. A commencement notice is listed in Malawi's 2024 subsidiary-legislation bulletin; counsel must verify the actual Gazette notice and current in-force position. Until verified, comply with the existing applicable consumer and competition framework and design to the newer Act's standards.

Required controls:
- No fake reviews, fabricated scarcity, hidden charges, misleading claims, deceptive ranking, false "verified" badges or false supplier authorisation claims.
- Label sponsored listings and paid placement clearly. Explain ranking and verification badges accurately.
- Disclose whether a creator is an independent business/individual and whether a buyer is a consumer or business; do not use this distinction to evade mandatory consumer rights.
- Give customers accessible complaint, cancellation, refund and dispute channels. Keep evidence and decision records.
- Prohibit discriminatory or abusive marketplace practices and monitor market power/exclusivity arrangements as NJIRA grows.
- Ensure advertising, influencer campaigns, testimonials, discounts and comparative claims are substantiated and not misleading.

### Payments, remittance and financial services
- **Payment Systems Act, 2016 (Act No. 15 of 2016)** and Reserve Bank of Malawi (RBM) regulations/directives govern payment systems and services. The Act restricts operating payment systems, remittance, e-money/mobile payment services or issuing payment instruments without RBM licence/authorisation.
- **Financial Services Act** and related RBM rules may apply depending on the actual product and activities.
- **Financial Crimes Act, 2017**, amendments and regulations establish Malawi's AML/CFT/CPF framework. Whether NJIRA itself is an accountable institution depends on the services and legal role it actually performs; do not assume either exemption or full regulated status.

Required controls:
- Use a properly licensed/authorised payment provider for collection, processing, settlement and payouts. Verify PayChangu's current RBM authorisation, permitted products, currencies, settlement arrangements and contractual scope directly before production.
- NJIRA must not receive, pool, hold, transmit, convert or remit customer/creator funds as a payment service or escrow unless Malawi counsel and RBM confirm the required licence/authorisation or a valid exemption. Prefer provider-controlled split settlement/direct payouts where contractually supported.
- Do not describe NJIRA balances as wallets, deposits, stored value or escrow unless legally authorised. A platform ledger showing amounts payable is not itself authority to hold customer funds.
- Do not store card PAN, CVV, PIN, OTP or online-banking credentials. Redirect/tokenise through the provider and follow the provider's PCI DSS responsibilities and current PCI DSS requirements.
- Verify payment server-to-server; reconcile provider settlement reports; enforce idempotency; screen suspicious patterns; preserve records; handle chargebacks and refunds.
- Define a risk-based fraud/AML escalation process with the payment provider. If NJIRA's actual activity makes it an accountable institution, implement required customer due diligence, beneficial-owner checks, records, suspicious transaction reporting, sanctions controls and compliance-officer arrangements as advised by counsel.
- Never promise foreign-currency receipt, conversion or creator withdrawals until RBM rules, provider capabilities, FX controls and the creator's payout route have been verified.

### Tax, company and intellectual property
- Obtain Malawi tax advice on company registration, income tax, VAT registration and treatment, withholding tax, payroll obligations, invoicing, marketplace commissions, agency versus principal treatment, cross-border supplies and foreign-currency records. Apply current MRA legislation, regulations and published guidance; do not assume every platform fee or tool sale has the same VAT treatment.
- Keep complete accounting records separating gross collections, platform revenue, creator/supplier payables, provider charges, taxes, refunds, FX and payouts. Issue compliant receipts/tax invoices where required.
- Register and maintain the correct business entity, beneficial ownership and annual filings; use written creator, client, supplier, employee and contractor agreements.
- **Copyright Act, 2016 (Act No. 26 of 2016)** protects eligible original works and performers' rights. Creators should retain ownership unless a clearly documented assignment or licence says otherwise. Client licences must specify permitted use, territory, term, media, exclusivity, modification, attribution and payment conditions.
- Obtain warranties that uploaders own or are authorised to distribute the work. Provide notice-and-action/takedown, counter-notice and repeat-infringer procedures, while preserving evidence and responding to valid court/regulator orders.
- Protect NJIRA's own trademarks, branding, software and confidential information; do not imply affiliation with third-party software vendors without permission.

## 3. International obligations — apply only where triggered

International compliance is country-specific. The following are examples, not an exhaustive worldwide list:

- **EU/EEA GDPR:** may apply when NJIRA offers goods/services to people in the EU/EEA or monitors their behaviour there. It brings lawful-basis, transparency, data-subject rights, processor contracts, security, breach, DPIA, representative (where required) and international-transfer obligations. Transfers from the EEA to Malawi or another third country need an applicable GDPR transfer mechanism and safeguards.
- **UK GDPR and UK Data Protection Act 2018:** may apply when NJIRA offers services to people in the UK or monitors their behaviour. UK restricted transfers require an applicable adequacy regulation, appropriate safeguard or exception.
- **Other markets:** assess local privacy/data localisation, consumer distance-selling and digital-content rules, sales taxes, payment licensing, sanctions/export controls, advertising, accessibility, IP and dispute jurisdiction before targeting or onboarding users there.
- **US:** assess state privacy laws and consumer-protection rules based on NJIRA's users and activities; payment-card obligations are generally driven by card-network/provider contracts and PCI DSS rather than one general US marketplace statute.
- **International payments:** comply with provider, card-network, correspondent-bank, foreign-exchange, sanctions and anti-fraud requirements that apply to the parties and payment corridors.

Do not treat GDPR consent as a universal lawful basis, and do not copy a generic GDPR template as a substitute for Malawi-specific compliance.

## 4. Marketplace role and contract design

For every transaction type, define who is legally supplying what:
1. **Creator services:** identify the creator as service provider where that is the real arrangement; NJIRA's role, commission, payment collection role, dispute support and liability boundaries must be accurate and not disclaim non-excludable duties.
2. **Creator digital/physical goods:** define seller-of-record, fulfilment, IP licence, delivery, returns and tax invoicing. The answer may differ by product and jurisdiction.
3. **NJIRA Tools:** if NJIRA sets the retail price, collects as seller, procures and supplies a licence/code, it may be the seller/reseller rather than a neutral marketplace. Obtain vendor resale permission and assume seller obligations unless counsel confirms otherwise.
4. **International client payments:** document who contracts with the creator, who receives the money, who performs FX conversion, which provider executes payouts, who bears fees/refunds/chargebacks and which country law governs.

Terms cannot change the legal reality of NJIRA's conduct. A disclaimer saying "we are only a platform" is not sufficient if NJIRA actually acts as seller, agent, payment intermediary or principal.

## 5. Mandatory pre-launch gates

No public launch of paid transactions until all relevant items are signed off:

- [ ] Malawi company/entity, beneficial ownership, tax registrations and accounting treatment reviewed.
- [ ] Malawi counsel approves terms of service, creator/client agreement, supplier/reseller agreement, privacy notice, cookie/tracking notice, refund/cancellation policy and dispute process.
- [ ] Data Protection Act compliance assessment complete; registration status determined; processing register, retention schedule, processor contracts, cross-border transfer register and incident plan ready.
- [ ] DPA registration and any required notifications completed if NJIRA falls within a registrable category.
- [ ] RBM/payment-provider legal perimeter reviewed; provider authorisation and contract verified; no unlicensed custody, escrow, remittance or stored-value function.
- [ ] PayChangu payment, settlement, refunds, chargebacks, international cards, currencies and creator payouts tested in the actual merchant account and sandbox/production approval.
- [ ] Consumer disclosures, order review, electronic acknowledgement, withdrawal/cancellation/refund logic and transaction-record retention tested.
- [ ] Each supplier/product/plan has written resale/procurement authority, regional eligibility, correct licence terms, verified delivery, refund route and positive contribution margin.
- [ ] IP ownership/licensing, takedown process, prohibited-content policy and creator warranties ready.
- [ ] Security review, access control, vulnerability testing, backups, incident response and breach notification workflow complete.
- [ ] Jurisdiction register completed for every country actively served; local counsel review completed where required.
- [ ] Tax treatment for local and cross-border supplies confirmed by a qualified adviser.
- [ ] Operations staff trained on complaints, refunds, data requests, fraud escalation and legal holds.

## 6. Engineering implications

The application must support these controls rather than relying on policy text alone:
- Store policy/terms/privacy versions and the exact version accepted, timestamp, user and transaction context.
- Keep immutable order snapshots of supplier identity, seller-of-record, price, tax treatment, fee, currency, delivery promise, cancellation terms and applicable jurisdiction.
- Store explicit consent when starting a service or digital-content delivery before an applicable withdrawal period expires; record exactly what the user agreed to and when. Counsel must approve the consent language and flow.
- Add customer data export, correction and deletion workflows, subject to lawful retention/legal holds.
- Add retention/deletion jobs, processor inventory, transfer records and breach-event workflow.
- Build a complaint/refund/dispute case record with deadlines, evidence and audit trail.
- Make paid placement disclosures, review moderation, seller verification and content takedown auditable.
- Keep provider-held funds and NJIRA accounting ledger separate; do not implement a customer wallet or escrow feature without separate legal approval.
- Add country gating so a product, payment method or feature cannot be activated in a jurisdiction before its compliance checklist is approved.
- Keep audit logs free of passwords, access tokens, payment credentials, private messages and unnecessary personal data.

## 7. Official and primary reference points

- Malawi Data Protection Authority: Data Protection Act, 2024, regulations, registration and breach guidance — https://www.dpa.mw/
- Malawi Communications Regulatory Authority (MACRA): Electronic Transactions and Cyber Security Act, 2016 and Communications Act — https://macra.mw/
- Reserve Bank of Malawi: Payment Systems Act, regulations, payment-service-provider authorisation and directives — https://www.rbm.mw/PaymentSystems/
- Financial Intelligence Authority: Financial Crimes Act, AML/CFT/CPF legislation and guidance — https://fia.gov.mw/legislation
- Competition and Fair Trading Commission: current competition and consumer-protection legislation — https://www.cftc.mw/legislations/
- Malawi Revenue Authority: tax laws, VAT and registration guidance — https://www.mra.mw/
- MalawiLII: accessible consolidated Malawi legislation — https://malawilii.org/
- European Commission: GDPR international transfer rules — https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en
- UK Information Commissioner's Office: UK GDPR international transfer guidance — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/

**Owner:** NJIRA legal/compliance owner (to be appointed).  
**Review cadence:** before launch; before adding a country, payment flow, data category, supplier model or major product; and at least quarterly thereafter.
