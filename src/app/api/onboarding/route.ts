import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";

export const runtime="nodejs";

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  const expectedOrigin=new URL(process.env.BETTER_AUTH_URL??request.url).origin;
  if(!origin||origin!==expectedOrigin) return NextResponse.json({error:"Request origin is not allowed."},{status:403});
  const session=await auth.api.getSession({headers:request.headers});
  if(!session?.user?.id) return NextResponse.json({error:"Sign in to complete your profile."},{status:401});
  const user=await prisma.user.findUnique({where:{id:session.user.id},select:{id:true,status:true,creatorProfile:{select:{id:true}},clientProfile:{select:{id:true}}}});
  if(!user||user.status!=="ACTIVE") return NextResponse.json({error:"This account cannot complete onboarding."},{status:403});
  if(user.creatorProfile||user.clientProfile) return NextResponse.json({error:"A profile has already been created for this account."},{status:409});
  let body:unknown; try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request body."},{status:400});}
  if(!body||typeof body!=="object") return NextResponse.json({error:"Invalid profile details."},{status:400});
  const input=body as Record<string,unknown>;
  const type=input.type; const displayName=typeof input.displayName==="string"?input.displayName.trim():"";
  const city=typeof input.city==="string"?input.city.trim().slice(0,80):"";
  if((type!=="creator"&&type!=="client")||displayName.length<2||displayName.length>80) return NextResponse.json({error:"Choose an account type and enter a valid display name."},{status:400});
  try {
    if(type==="creator") {
      const handle=typeof input.handle==="string"?input.handle.trim().toLowerCase():"";
      if(!/^[a-z0-9_-]{3,24}$/.test(handle)) return NextResponse.json({error:"Your handle must be 3–24 characters and use letters, numbers, underscores or hyphens."},{status:400});
      await prisma.creatorProfile.create({data:{userId:user.id,handle,displayName,city:city||null,countryCode:"MW"}});
    } else {
      const company=typeof input.company==="string"?input.company.trim().slice(0,100):"";
      await prisma.clientProfile.create({data:{userId:user.id,displayName,company:company||null,city:city||null,countryCode:"MW"}});
    }
  } catch(error) {
    if(typeof error==="object"&&error!==null&&"code" in error&&error.code==="P2002") return NextResponse.json({error:"That profile handle is already taken. Try another."},{status:409});
    console.error("NJIRA onboarding profile creation failed.");
    return NextResponse.json({error:"We could not save your profile. Please try again."},{status:500});
  }
  return NextResponse.json({success:true});
}
