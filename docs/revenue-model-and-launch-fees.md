# NJIRA revenue model and launch fee policy

Status: proposed operating policy for product and engineering review. These are launch defaults, not live charges. Do not expose or collect a fee until checkout, creator terms, payout handling and refund rules implement it consistently.

## 1. Revenue priorities

NJIRA should earn by facilitating successful transactions and useful services, not by charging people simply to join.

| Revenue stream | Launch timing | Proposed approach |
| --- | --- | --- |
| Creator-service commission | Launch | 8% of completed project value, deducted from creator proceeds and disclosed before acceptance |
| NJIRA Tools gross margin | Launch only for approved SKUs | Retail price minus supplier cost, payment costs, FX/conversion costs, refunds and fulfilment/support costs |
| NJIRA Premium | Later, after repeat usage | Optional subscription for extra workflow and visibility features; core access and opportunity discovery stay free |
| Promoted placement | Later, after meaningful buyer traffic | Clearly labelled paid placement with a defined duration and impression/click reporting |
| Partnerships | As qualified partners emerge | Disclosed referral or commercial fees; no pay-to-win ranking disguised as organic recommendations |

Do not launch with registration fees, paid applications, listing fees and transaction commission all at once. Multiple upfront charges create friction before users have experienced value.

## 2. Creator-service commission

**Proposed launch rate: 8% of the agreed project subtotal.**

- Charge only when a project payment is successfully verified and captured.
- Show the amount and calculation to both parties before the client pays and before the creator accepts the order.
- Deduct the commission from creator proceeds; do not add an undisclosed surcharge at the final payment step.
- The rate should be configurable by an authorised administrator, but each order must snapshot the exact rate and fee amount used. Never recalculate historical orders from the current setting.
- Do not charge commission on a cancelled, unpaid project.
- For partial refunds, reverse the corresponding commission proportionally. For full refunds, reverse the full commission. Record provider fees and any non-refundable payment costs separately.
- Any future promotional rate must have explicit start/end dates and eligibility rules.

Example, assuming a MWK 200,000 project and no separately charged client-side fees:

| Item | Amount |
| --- | ---: |
| Client project payment | MWK 200,000 |
| NJIRA commission (8%) | MWK 16,000 |
| Creator proceeds before payout/provider costs | MWK 184,000 |

This is a gross allocation example, not a promise that MWK 184,000 will be the final bank/mobile-money payout. Provider charges, taxes, payout fees, refunds and settlement differences must be accounted for separately and disclosed where they affect the creator.

A later pricing experiment could test 5%, 8% and 10% against creator retention, transaction completion and support costs. Do not raise the rate based only on gross transaction volume.

## 3. NJIRA Tools pricing

Do not apply a blanket percentage markup to every product. Set each SKU's retail price from verified supplier cost and total expected cost-to-serve.

For each order, calculate:

`Contribution = customer amount collected - supplier cost - payment processing cost - FX/conversion cost - expected refund/failure cost - variable fulfilment/support cost`

Keep customer price/currency and supplier cost/currency distinct. If currencies differ, record the actual FX rate, conversion amount, timestamp and fees used; never subtract USD directly from MWK. A displayed exchange-rate estimate is not a settlement record.

Example in one currency only:

| Item | Amount |
| --- | ---: |
| Customer pays | MWK 30,000 |
| Supplier cost | MWK 23,000 |
| Gross spread before other costs | MWK 7,000 |

The MWK 7,000 is not net profit. Deduct payment fees, conversion, refunds, failed fulfilments and support costs before judging whether the SKU is viable. If the verified contribution is too small or negative, do not list it.

No tool should be advertised as available in Malawi until supplier authorisation, regional eligibility, fulfilment and refund handling have passed the supplier checklist.

## 4. Premium and promoted placement

These are later-stage experiments, not launch dependencies.

Possible Premium test price points: MWK 3,000, MWK 5,000 or MWK 10,000 per month. Choose one only after interviews and willingness-to-pay tests. Candidate benefits include portfolio analytics, additional portfolio customisation, workflow tools and enhanced profile controls. Do not sell guaranteed jobs, guaranteed sales or access to essential opportunities.

Promoted placement should only be sold once NJIRA has real buyer demand. Label sponsored results, define the duration and placement, and keep organic ranking separate. A paid placement must not imply endorsement or verification that has not occurred.

## 5. Ledger and payment rules

Every project transaction should be reconcilable as separate amounts, not one opaque "NJIRA earnings" figure.

For a successful project payment, the ledger should distinguish:
- Buyer funds collected (gross).
- Payment-provider fee (actual verified amount).
- NJIRA platform commission (earned revenue).
- Creator payable (amount owed to creator).
- Refunds, reversals, chargebacks and payout movements.

For NJIRA Tools, distinguish:
- Customer sale proceeds.
- Provider/payment fee.
- Supplier payable or supplier cost.
- FX/conversion cost and realised exchange rate where relevant.
- Refund/chargeback and fulfilment adjustment.
- NJIRA contribution margin.

Use the order's immutable fee and price snapshots. Use idempotency keys and unique references so repeated webhooks or retries cannot create duplicate ledger entries. A browser redirect is never proof of payment. Verify payment server-to-server and reconcile provider settlements against internal ledger records.

Do not treat gross merchandise value (GMV), total customer collections, creator payable, gross margin and net profit as interchangeable:
- **GMV:** value of completed transactions facilitated.
- **NJIRA revenue:** commission and other fees NJIRA has actually earned, plus recognised tool-sale revenue under the chosen accounting treatment.
- **Contribution margin:** revenue less variable transaction, supplier, fulfilment and support costs.
- **Net profit:** contribution after operating expenses, taxes and other obligations.

Confirm accounting treatment with a qualified accountant before statutory reporting.

## 6. Founder compensation and cash discipline

Customer collections are not automatically founder income. Maintain separate business records and accounts. Pay operating costs and statutory obligations, retain an agreed working-capital reserve, then pay a documented founder salary or declared distribution in line with the company's legal and tax position. Do not withdraw creator funds or supplier funds as if they were platform revenue.

## 7. Metrics to review monthly

Track by service category and currency:
- GMV and completed paid orders.
- Effective take rate (commission earned divided by eligible completed project GMV).
- Checkout success and payment-provider cost per successful transaction.
- Creator payout amount and payout completion time.
- Tool contribution margin per SKU after all variable costs.
- Refund, chargeback, failed-fulfilment and support-contact rates.
- Repeat buyer rate, creator retention and off-platform leakage.
- Premium conversion and promoted-placement outcomes when those products exist.

The first objective is repeat successful transactions and trust. Increase monetisation only when NJIRA is delivering measurable value and can support the additional operational burden.
