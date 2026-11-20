import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";
import { SignOutButton } from "@/components/sign-out-button";
import { WorkspaceActions } from "@/components/workspace-actions";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true, email: true, status: true,
      creatorProfile: { select: { id: true, displayName: true, handle: true, city: true, listings: { where: { status: "DRAFT" }, select: { id: true } } } },
      clientProfile: { select: { id: true, displayName: true, company: true, city: true } },
      briefs: { where: { status: "DRAFT" }, select: { id: true } }
    }
  });
  if (!user || user.status !== "ACTIVE") redirect("/login");
  if (!user.creatorProfile && !user.clientProfile) redirect("/onboarding");
  const creator = Boolean(user.creatorProfile);
  const profile = user.creatorProfile ?? user.clientProfile;
  const detail = user.creatorProfile ? "@" + user.creatorProfile.handle : (user.clientProfile?.company || "Client profile");
  const drafts = creator ? user.creatorProfile?.listings.length ?? 0 : user.briefs.length;
  return <main className="account-shell">
    <header className="onboarding-top"><Link className="auth-wordmark" href="/">NJIRA<span>®</span></Link><SignOutButton /></header>
    <section className="account-content account-content-wide">
      <p className="eyebrow">YOUR NJIRA WORKSPACE / {creator ? "CREATOR" : "CLIENT"}</p>
      <h1>Make room<br/><em>for the work.</em></h1>
      <p className="auth-form-intro">{profile?.displayName ?? user.name} · {profile?.city || "Malawi"} · {detail}</p>
      <div className="workspace-overview">
        <div><span>ACCOUNT</span><strong>ACTIVE</strong></div>
        <div><span>PRIVATE DRAFTS</span><strong>{drafts.toString().padStart(2, "0")}</strong></div>
        <div><span>VISIBILITY</span><strong>PRIVATE</strong></div>
      </div>
      <WorkspaceActions creator={creator} />
      <p className="workspace-footnote">Drafts are saved to your account and are not publicly discoverable. Publishing, editing existing drafts, moderation, proposals and payments are not enabled in this stage.</p>
    </section>
  </main>;
}
