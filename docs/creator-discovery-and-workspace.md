# Creator discovery and workspace draft stage

**Status:** initial creator discovery pages and private draft creation are implemented on the feature branch. This is not yet a complete marketplace publishing workflow.

## Public discovery

- `/creators` lists only creator profiles belonging to active user accounts that have at least one `ACTIVE` listing.
- `/creators/[handle]` displays a public creator profile and only that creator's `ACTIVE` listings.
- Public profile queries select an explicit allowlist of fields. They do not return account email, user IDs, private draft content, supplier data or payout information.
- Website links are rendered only when the stored value begins with HTTP or HTTPS.
- Creator pages are not a promise of verification; the verification marker is shown only when the stored `isVerified` flag is true.

## Private draft creation

- Creator accounts can create service listing drafts in MWK.
- Client accounts can create project brief drafts in MWK with optional budget bounds.
- API handlers require a valid Better Auth session, an active user and the appropriate profile type.
- Ownership identifiers are derived from the session and profile lookup, never accepted from the browser.
- Both write routes validate same-origin requests and constrain user input.
- New listings and briefs are explicitly saved with `DRAFT` status and do not appear in public discovery.

## Important limitations

- No public listing/brief publishing endpoint is included.
- No moderation queue, staff approval UI, or server-side staff-role enforcement is included. Do not change drafts to `ACTIVE` through an unprotected route.
- No creator profile editing, portfolio media upload, listing editing, search ranking, proposals, messaging, order checkout, payments or payouts are enabled by this stage.
- The public profile page is currently service-listing based; it is not yet a rich image portfolio.
- A database migration has not been generated or applied for this stage. The `BriefStatus.DRAFT` enum addition requires a reviewed migration before deployment.
- Existing production registration remains blocked until email, database and security launch gates in `docs/authentication.md` are satisfied.

## Required next controls

1. Generate and review a migration for the new brief draft enum value.
2. Add role-checked moderation routes and audit events before any public publishing workflow.
3. Add profile editing with field-level validation and privacy controls.
4. Add safe media upload through a private object-storage bucket, malware scanning and explicit public asset promotion.
5. Add automated authorization tests for creator/client separation, cross-account access and draft invisibility.
6. Add staging end-to-end tests against PostgreSQL before production deployment.
