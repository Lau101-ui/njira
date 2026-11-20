# Creator discovery and workspace

**Status:** creator discovery, private draft creation and creator profile editing are implemented on the feature branch. This is not yet a complete marketplace publishing workflow.

## Public discovery

- `/creators` lists only creator profiles belonging to active user accounts that have at least one `ACTIVE` listing.
- `/creators/[handle]` displays a public creator profile and only that creator's `ACTIVE` listings.
- Public profile queries select an explicit allowlist of fields. They do not return account email, user IDs, private draft content, supplier data or payout information.
- Website links are accepted by the profile editor only when they are valid HTTPS URLs; public rendering must continue to enforce safe protocols.
- The verification marker is shown only when the stored `isVerified` flag is true.

## Creator profile editing

- Authenticated creators can update display name, headline, biography, city, HTTPS website and availability.
- The API verifies same-origin requests, Better Auth session, active account and creator-profile ownership.
- Handle changes are deliberately excluded to avoid breaking public identity URLs.
- Account email, verification status, account status, country, ownership IDs and moderation fields cannot be changed through this endpoint.
- Client accounts cannot use the creator profile endpoint.

## Private draft creation

- Creator accounts can create service listing drafts in MWK.
- Client accounts can create project brief drafts in MWK with optional budget bounds.
- Ownership identifiers are derived from the session and profile lookup, never accepted from the browser.
- New listings and briefs are explicitly saved with `DRAFT` status and do not appear in public discovery.

## Portfolio and media security

- A rich portfolio upload flow is intentionally not enabled yet. Do not accept arbitrary upload URLs or store user-supplied files in the application web root.
- Before media upload, provision private object storage, short-lived signed upload URLs, strict MIME/extension and size allowlists, malware scanning, metadata stripping, image/video transcoding, abuse reporting and an explicit moderation/publish step.
- Keep original uploads private; only approved derivatives should be served publicly through a controlled CDN.
- Portfolio project records should support draft/public states and owner-scoped read/write checks. No public media should appear before approval.

## Remaining limitations and launch gates

- No public listing/brief publishing endpoint, moderation queue, staff approval UI or server-side staff-role enforcement is included.
- Listing editing, portfolio projects/media, search ranking, proposals, messaging, order checkout, payments and payouts are not enabled.
- A database migration has not been generated or applied for the existing `BriefStatus.DRAFT` enum addition. Review and apply migrations before deployment.
- Add automated authorization tests for creator/client separation, cross-account access, profile field restrictions and draft invisibility.
- Run staging end-to-end tests against PostgreSQL before production deployment.
- Existing production registration remains blocked until email, database and security launch gates in `docs/authentication.md` are satisfied.
