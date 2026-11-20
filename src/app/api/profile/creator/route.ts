import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function PATCH(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.BETTER_AUTH_URL ?? request.url).origin;
  if (!origin || origin !== expectedOrigin) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const displayName = clean(input.displayName, 80);
  const headline = clean(input.headline, 120);
  const bio = clean(input.bio, 1200);
  const city = clean(input.city, 80);
  const website = clean(input.website, 240);
  const acceptingWork = input.acceptingWork;

  if (displayName.length < 2 || (input.headline !== undefined && typeof input.headline !== "string") ||
      (input.bio !== undefined && typeof input.bio !== "string") ||
      (input.city !== undefined && typeof input.city !== "string") ||
      (input.website !== undefined && typeof input.website !== "string") ||
      typeof acceptingWork !== "boolean") {
    return NextResponse.json({ error: "Check the profile fields and try again." }, { status: 400 });
  }
  if (website) {
    try {
      const parsed = new URL(website);
      if (parsed.protocol !== "https:" || !parsed.hostname.includes(".") || parsed.username || parsed.password) throw new Error();
    } catch { return NextResponse.json({ error: "Website must be a valid HTTPS address." }, { status: 400 }); }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true, creatorProfile: { select: { id: true } } }
  });
  if (!user || user.status !== "ACTIVE") return NextResponse.json({ error: "This account cannot update its profile." }, { status: 403 });
  if (!user.creatorProfile) return NextResponse.json({ error: "Creator profile not found." }, { status: 404 });

  await prisma.creatorProfile.update({
    where: { id: user.creatorProfile.id },
    data: {
      displayName,
      headline: headline || null,
      bio: bio || null,
      city: city || null,
      website: website || null,
      acceptingWork
    }
  });
  return NextResponse.json({ success: true });
}
