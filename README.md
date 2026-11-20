# NJIRA — Creative ecosystem

NJIRA connects creators, clients, creative services, digital and physical products, creative tools, learning, and collaboration. The initial experience is designed Malawi-first, with room to expand internationally.

## Current stage

This repository contains a **frontend design prototype**, not a production marketplace.

### Main entry point

Open `index.html` in a modern browser. It is the current unified experience and combines:
- The chapter-led scroll journey and progress rail from the original `102.html`, with section-aligned 3D waypoints.
- The newer visual direction and interactive Three.js creative path.
- Discovery, marketplace categories, creative tools, learning, and project-workflow storytelling.
- Selected Unsplash stock-photo references to demonstrate the intended visual treatment; these are illustrative placeholders, not creator submissions.

### Reference prototypes

- `102.html` — original NJIRA creative-tools directory, retained as a reference for its scroll chapters, path navigation, language switcher, and tool filters.
- `njira-interaction-demo-3d.html` — earlier 3D visual direction prototype.

## Visual system

- Deep Lake: `#102326`
- Warm Limestone: `#F2F0E8`
- Lake Mist: `#A8C4B7`
- Signal Orange: `#F07855`
- Reed Green: `#B5C6A2`
- Stone: `#E5E1D5`

## Important prototype limitations

The marketplace cards and creator examples are illustrative, not live listings. Stock photography is used as temporary art direction and must be replaced or supplemented with properly licensed creator-owned media before launch. Tool listings and pricing should be verified before publication.

Authentication, database, messaging, project briefs, proposals, milestones, file storage, checkout, PayChangu payment processing, digital-tool supplier fulfilment, seller payouts, subscriptions, admin controls, and production security are **not implemented** in this frontend prototype. The `foundation/marketplace-paychangu` branch adds an initial Prisma data model, architecture decisions, a server-side PayChangu adapter, security baseline, repository safeguards and CI checks as engineering groundwork; these are not yet wired into a running application. The early-access button only explains this limitation; it does not collect user data.

## Running

Open `index.html` in a modern browser. An internet connection is needed for Google Fonts, the external Three.js library, and the remote stock-image references. If WebGL is unavailable, the rest of the page should remain usable without the 3D scene.

## Next engineering steps

1. Complete hands-on browser QA on desktop and mobile, including navigation, filters, scroll behaviour, WebGL fallback and reduced-motion behaviour.
2. Convert the approved visual prototype into a maintainable application structure without losing its visual identity.
3. Define the NJIRA domain model and API contracts before implementing marketplace workflows.
4. Build and test authentication, database, media storage, creator profiles, listings, briefs, proposals and messaging.
5. Integrate PayChangu only after the order, payment-state, webhook and reconciliation flows are designed and tested.


## NJIRA Tools engineering foundation

The `feature/creator-tools-commerce` branch extends the marketplace data model for a focused catalogue of creator software, AI services and creator infrastructure. It adds supplier, product-plan, digital-service order and fulfilment records, plus separate payment/ledger references. See `docs/creator-tools-commerce.md` and `docs/supplier-onboarding-checklist.md`. This is a domain foundation, not a live reseller relationship or working supplier integration.

### Legal and regulatory baseline

The branch also includes `docs/legal-and-regulatory-compliance.md`, a Malawi-first compliance baseline covering data protection, electronic commerce, consumer rights, payments, tax, intellectual property and jurisdiction-specific international obligations. It is an engineering checklist, not a legal opinion or proof of compliance. No paid launch should proceed until qualified Malawi counsel, tax advice and the relevant regulators/payment-provider requirements have been addressed.

