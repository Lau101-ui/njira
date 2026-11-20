import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function CreatorPublicPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const creator = process.env.DATABASE_URL ? await prisma.creatorProfile.findFirst({
    where: { handle: { equals: handle, mode: "insensitive" }, user: { status: "ACTIVE" } },
    select: { handle: true, displayName: true, headline: true, bio: true, city: true, countryCode: true, website: true, isVerified: true, acceptingWork: true,
      listings: { where: { status: "ACTIVE" }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, slug: true, summary: true, description: true, price: true, currency: true, deliveryDays: true, type: true }, take: 60 } }
  }).catch(() => null) : null;
  if (!creator || creator.listings.length === 0) notFound();
  const websiteUrl = creator.website && /^https?:\/\//i.test(creator.website) ? creator.website : null;
  return <main className="creator-public-page">
    <header className="tools-topbar"><Link className="wordmark" href="/">NJIRA<span>®</span></Link><span className="tools-topbar-note">CREATOR PROFILE / {creator.countryCode}</span><Link className="tools-back-link" href="/creators">All creators ↗</Link></header>
    <section className="creator-profile-hero"><p className="eyebrow">NJIRA CREATOR / {creator.isVerified?"VERIFIED":"INDEPENDENT"}</p><div className="creator-profile-monogram">{creator.displayName.trim().charAt(0).toUpperCase()}</div><h1>{creator.displayName}{creator.isVerified&&<span className="verified-mark"> ✓</span>}</h1><p className="creator-profile-headline">{creator.headline||"Independent creative"}{creator.city?" · "+creator.city:""}</p>{creator.bio&&<p className="creator-profile-bio">{creator.bio}</p>}<div className="creator-profile-meta"><span>{creator.acceptingWork?"OPEN TO NEW WORK":"CURRENTLY UNAVAILABLE"}</span>{websiteUrl&&<a href={websiteUrl} target="_blank" rel="noopener noreferrer">PERSONAL WEBSITE ↗</a>}</div></section>
    <section className="creator-services"><div className="creator-services-heading"><div><p className="eyebrow">SELECTED SERVICES</p><h2>Work worth<br/><em>moving for.</em></h2></div><span>{String(creator.listings.length).padStart(2,"0")} / LIVE LISTINGS</span></div><div className="creator-service-grid">{creator.listings.map((listing,i)=><article className="creator-service-card" key={listing.id}><div className="creator-service-index">{String(i+1).padStart(2,"0")} / {listing.type.replaceAll("_"," ")}</div><h3>{listing.title}</h3><p>{listing.summary}</p><div className="creator-service-bottom"><strong>{new Intl.NumberFormat("en", {style:"currency",currency:listing.currency,maximumFractionDigits:0}).format(Number(listing.price))}</strong>{listing.deliveryDays&&<span>{listing.deliveryDays} DAY DELIVERY</span>}</div></article>)}</div></section>
    <footer className="tools-footer"><Link className="wordmark" href="/">NJIRA<span>®</span></Link><p>THE RIGHT PEOPLE. A CLEARER WAY FORWARD.</p><Link href="/creators">DISCOVER MORE ↗</Link></footer>
  </main>;
}
