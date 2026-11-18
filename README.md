# NJIRA — Creative ecosystem

NJIRA connects creators, clients, creative services, digital and physical products, creative tools, learning, and collaboration. The initial experience is designed Malawi-first, with room to expand internationally.

## Current stage

This repository contains a **frontend design prototype**, not a production marketplace.

### Main entry point

Open `index.html` in a modern browser. It is the current unified experience and combines:
- The chapter-led scroll journey and progress rail from the original `102.html`.
- The newer visual direction and interactive Three.js creative path.
- Discovery, marketplace categories, creative tools, learning, and project-workflow storytelling.
- Selected stock-photo references to demonstrate the intended visual treatment.

### Reference prototypes

- `102.html` — original NJIRA creative-tools directory, retained as a reference for its scroll chapters, path navigation, language switcher, and tool filters.
- `njira-interaction-demo-3d.html` — earlier 3D visual direction prototype.

## Visual system

- Deep aubergine ink: `#17151D`
- Warm parchment: `#F3EFE6`
- Mineral periwinkle: `#A9B7FF`
- Ember coral: `#FF715B`
- Muted jade: `#B5CFC7`

## Important prototype limitations

The marketplace cards and creator examples are illustrative, not live listings. Stock photography is used as temporary art direction and must be replaced or supplemented with properly licensed creator-owned media before launch. Tool listings and pricing should be verified before publication.

Authentication, database, messaging, project briefs, proposals, milestones, file storage, checkout, PayChangu payment processing, seller payouts, subscriptions, admin controls, and production security are **not implemented** in this frontend prototype. The early-access button only explains this limitation; it does not collect user data.

## Running

Open `index.html` in a modern browser. An internet connection is needed for Google Fonts, the external Three.js library, and the remote stock-image references. If WebGL is unavailable, the rest of the page should remain usable without the 3D scene.

## Next engineering steps

1. Browser-test desktop and mobile layouts, navigation, filters, scroll behavior, and the 3D interaction.
2. Improve reduced-motion and low-performance-device behavior; verify keyboard accessibility.
3. Replace the static sample content with real marketplace data.
4. Convert the approved frontend into a maintainable application structure.
5. Build and test authentication, database, storage, messaging, marketplace workflows, and payment integration separately.
