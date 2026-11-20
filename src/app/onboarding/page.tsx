import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage({searchParams}:{searchParams:Promise<{type?:string}>}) {
 const session=await auth.api.getSession({headers:await headers()});
 if(!session?.user?.id) redirect("/login");
 const user=await prisma.user.findUnique({where:{id:session.user.id},select:{status:true,creatorProfile:{select:{id:true}},clientProfile:{select:{id:true}}}});
 if(!user||user.status!=="ACTIVE") redirect("/login");
 if(user.creatorProfile||user.clientProfile) redirect("/account");
 const params=await searchParams;
 const initialType=params.type==="client"?"client":"creator";
 return <main className="onboarding-shell"><header className="onboarding-top"><Link className="auth-wordmark" href="/">NJIRA<span>®</span></Link><span>PROFILE SETUP / 01</span></header><section className="onboarding-content"><p className="eyebrow">YOUR PLACE IN THE ECOSYSTEM</p><h1>First, tell us<br/><em>how you work.</em></h1><p className="auth-form-intro">Choose how you want to use NJIRA. You can build out the rest of your profile later.</p><OnboardingForm initialType={initialType}/></section></main>;
}
