import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AccountPage(){
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user?.id) redirect("/login");
 const user=await prisma.user.findUnique({where:{id:session.user.id},select:{name:true,email:true,status:true,creatorProfile:{select:{displayName:true,handle:true,city:true}},clientProfile:{select:{displayName:true,company:true,city:true}}}});
 if(!user||user.status!=="ACTIVE") redirect("/login");
 if(!user.creatorProfile&&!user.clientProfile) redirect("/onboarding");
 const profile=user.creatorProfile??user.clientProfile;
 const type=user.creatorProfile?"CREATOR":"CLIENT";
 const detail=user.creatorProfile?("@"+user.creatorProfile.handle):(user.clientProfile?.company||"Client profile");
 return <main className="account-shell"><header className="onboarding-top"><Link className="auth-wordmark" href="/">NJIRA<span>®</span></Link><SignOutButton/></header><section className="account-content"><p className="eyebrow">YOUR NJIRA ACCOUNT / {type}</p><h1>Welcome,<br/><em>{profile?.displayName??user.name}.</em></h1><p className="auth-form-intro">{user.email} · {profile?.city||"Malawi"}</p><div className="account-card"><span>PROFILE STATUS</span><strong>FOUNDATION CREATED</strong><p>{detail}</p></div><div className="account-next"><p>Your account is active. Profile editing, listings, briefs and collaboration tools will be connected in the next marketplace stages.</p><Link className="auth-submit auth-submit-link" href="/">RETURN TO NJIRA <span>↗</span></Link></div></section></main>;
}
