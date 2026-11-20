# NJIRA currency, pricing and creator-fee policy

## Initial supported currencies

NJIRA's initial checkout currencies are:
- **MWK** for Malawi-first local transactions.
- **USD** for international buyers and creators who choose to price in USD.

This is deliberately narrower than a generic ISO currency selector. PayChangu Standard Checkout currently documents MWK and USD; adding GBP, EUR, ZAR or other display currencies must not be confused with support for charging or settling those currencies.

## Price ownership and checkout

1. A creator selects MWK or USD when creating a listing or proposal.
2. The selected currency is stored with the price and copied into the order snapshot.
3. The buyer sees the exact amount and currency before paying.
4. The server calculates totals, fees and provider amount from persisted records.
5. The payment record stores the expected amount and currency; provider verification must match both.
6. If the buyer's card is denominated in another currency, their issuer/card network handles conversion and may add a fee. NJIRA must not promise a guaranteed FX rate.

Never calculate a charge by converting a listing price in browser JavaScript. Never use floating-point arithmetic for money.

## Display conversion

A future convenience feature may display an approximate equivalent (for example, MWK price alongside an estimated USD equivalent). It must be clearly labelled as an estimate and must not alter the checkout amount.

A future buyer-selected settlement currency requires a server-created, short-lived quote containing:
- source amount and currency;
- charge amount and currency;
- rate and rate source;
- quote timestamp and expiry;
- any NJIRA markup or conversion fee;
- the policy version used.

The quote must be locked to the order and revalidated before checkout. A changed or expired quote requires buyer consent to the new total.

## Creator application fees

A fee for submitting proposals is a separate NJIRA platform charge. It is not a client payment and must never be presented as creator earnings or as money held for a creator.

Required controls:
- explicit fee disclosure before the creator applies;
- fee policy with amount, currency, effective date and version;
- server-side eligibility and fee calculation;
- proposal remains unsubmitted until the application payment is independently verified;
- one successful fee payment can submit only its linked proposal;
- duplicate requests and webhook replays cannot create duplicate submissions or ledger entries;
- refunds and failed attempts follow a published policy;
- fee collection and any later refund are represented by immutable ledger entries.

Product decision still required before enabling the fee: whether every application is chargeable, whether creators receive a monthly free quota, or whether fees apply only to premium/boosted applications. Charging for every application can reduce the number and diversity of proposals, especially for early-stage creatives. Prefer a modest, optional paid boost or limited free applications until marketplace liquidity is demonstrated.

## Separate money ledgers

Track balances by currency. An MWK payable and a USD payable are different liabilities. Do not add them together or convert one to the other in reports without a recorded conversion transaction, provider reference, rate, fees and timestamp.

## Launch gates

- Confirm PayChangu USD whole-unit/minor-unit behavior using sandbox transactions.
- Confirm USD settlement wallet activation and withdrawals for NJIRA's merchant account.
- Confirm international card availability, refunds and chargeback treatment.
- Confirm PayChangu Connect eligibility and commission/split settlement for the actual NJIRA account and creator onboarding model.
- Confirm creator KYC and payout rails. A USD collection wallet does not prove creators can withdraw USD internationally.
- Obtain written provider answers for any capability not unambiguously documented.
- Keep production payments and creator payouts disabled until sandbox end-to-end tests and reconciliation controls pass.
