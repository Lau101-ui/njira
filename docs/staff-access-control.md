# NJIRA staff access control foundation

**Status:** schema contract only. This is not a working authentication, authorisation, admin portal or security certification.

## Roles

| Role | Intended scope |
|---|---|
| `PLATFORM_ADMIN` | Platform configuration and staff provisioning; must not be used for routine supplier review. |
| `SUPPLIER_OPERATIONS` | Supplier application completeness, operational checks and information requests. |
| `COMPLIANCE_REVIEWER` | Legal entity, authorisation, regional eligibility and jurisdiction review. |
| `PRIVACY_OFFICER` | Data-subject request cases, privacy incidents and privacy-control oversight. |
| `FINANCE_REVIEWER` | Supplier settlement, fees, currency and reconciliation review. |

Roles are additive, not hierarchical. A platform administrator does not automatically become a compliance reviewer, privacy officer or finance reviewer. Assign only the minimum roles needed.

## Enforcement requirements

1. Authenticate the request with the eventual identity provider and resolve the immutable provider subject server-side. Never accept a user ID, role, reviewer subject or permission from request JSON, query parameters or browser storage.
2. Resolve the subject to an active NJIRA user. Reject suspended/deleted users.
3. Load role assignments from the database on the server. A role is effective only when `revokedAt IS NULL` and `expiresAt IS NULL OR expiresAt > now()`.
4. Require the specific role for each operation. Supplier application intake, operational review, compliance approval, finance review and privacy case access are separate permissions.
5. Require MFA for all privileged staff sessions. Re-authenticate for role grants/revocations, supplier approval, jurisdiction approval and sensitive evidence access.
6. Record every grant/revocation in `StaffRoleAuditEvent`, including actor subject and reason. Keep independent security logs; database audit rows alone are not tamper-proof against a database administrator.
7. Role provisioning must happen through a controlled operator process after identity verification and approval. Do not expose a self-service endpoint that can create or modify staff roles.
8. Supplier approval must not implicitly activate a product, plan, country feature or checkout route. Those require separate evidence and approvals.
9. Restrict evidence reads to the assigned operational/compliance roles and log each access. Return opaque evidence references only to authorised server-side handlers.
10. Use deny-by-default checks. Missing identity, role, audit context, or jurisdiction approval means deny.

## Suggested permission mapping

- Read applicant's own application and edit draft: authenticated applicant, owner check.
- Submit/withdraw own application: authenticated applicant, owner check, valid state transition.
- Request missing information: `SUPPLIER_OPERATIONS`.
- Mark operational checks complete: `SUPPLIER_OPERATIONS`.
- Approve/reject supplier authorisation: `COMPLIANCE_REVIEWER`, with recorded evidence and reason.
- Verify settlement economics: `FINANCE_REVIEWER`.
- Read privacy cases or record privacy decisions: `PRIVACY_OFFICER`.
- Grant/revoke staff roles: separately controlled provisioning process; require two-person approval for production.
- Approve a country/feature release: `COMPLIANCE_REVIEWER` plus a recorded legal review reference; production policy may require a second approver.

## Schema limitations and next steps

The Prisma models provide role assignment and audit data structures only. They do not enforce permissions at the database level, guarantee append-only audit integrity, provide MFA, or establish a trusted identity. The audit event's actor and assignment references are opaque identifiers pending selection of the identity provider and staff provisioning design.

Before any staff portal is exposed:
- choose and integrate an identity provider;
- implement server-only session validation and resource-level authorisation;
- add MFA and privileged-session controls;
- implement controlled role provisioning and independent audit export;
- add IDOR, privilege escalation, expired/revoked role, suspended-user and cross-tenant tests;
- generate and review a migration, then test it on a disposable PostgreSQL database;
- complete independent security and Malawi legal/privacy review.

Do not accept real supplier applications or upload sensitive evidence until these controls and private encrypted evidence storage are operational.
