import Link from "next/link";
import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const creators = process.env.DATABASE_URL ? await prisma.creatorProfile.findMany({
    where: { user: { status: "ACTIVE" }, listings: { some: { status: "ACTIVE" } } },
    orderBy: { updatedAt: "desc" }, take: 48,
    select: { handle: true, displayName: true, headline: true, city: true, countryCode: true, isVerified: true, listings: { where: { status: "ACTIVE" }, select: { id: true }, take: 1 } }
  }).catch(() => []) : [];
  return <main className="creators-page">
    <header className="tools-topbar"><Link className="wordmark" href="/">NJIRA<span>®</span></Link><span className="tools-topbar-note">THE CREATIVE NETWORK / 03</span><Link className="tools-back-link" href="/">Back to NJIRA ↗</Link></header>
    <section className="creators-hero"><p className="eyebrow">PEOPLE BEHIND THE WORK</p><h1>Find your<br/><em>creative people.</em></h1><p>Explore creators with published services on NJIRA. Only reviewed, publicly active listings appear here.</p><span className="creators-count">{String(creators.length).padStart(2,"0")} / VISIBLE PROFILES</span></section>
    <section className="creators-grid-wrap">{creators.length ? <div className="creators-grid">{creators.map((creator,i)=><Link className="creator-tile" href={"/creators/"+encodeURIComponent(creator.handle)} key={creator.handle}><div className="creator-tile-index">{String(i+1).padStart(2,"0")} <span>{creator.countryCode}</span></div><div className="creator-monogram">{creator.displayName.trim().charAt(0).toUpperCase()}</div><h2>{creator.displayName}{creator.isVerified&&<span className="verified-mark" aria-label="Verified creator"> ✓</span>}</h2><p>{creator.headline||"Independent creative"}{creator.city?" · "+creator.city:""}</p><div className="creator-tile-bottom"><span>{creator.listings.length}+ ACTIVE SERVICE</span><b>↗</b></div></Link>)}</div> : <div className="creators-empty"><span>THE NETWORK IS TAKING SHAPE</span><h2>Good work deserves<br/><em>to be discovered.</em></h2><p>Public creator profiles will appear here once their services have passed review. Private drafts and unreviewed work remain invisible.</p><Link href="/sign-up">BUILD YOUR PROFILE ↗</Link></div>}</section>
    <footer className="tools-footer"><Link className="wordmark" href="/">NJIRA<span>®</span></Link><p>CREATIVE WORK, WITH A CLEARER WAY FORWARD.</p><span>© {new Date().getFullYear()} NJIRA</span></footer>
  </main>;
}
