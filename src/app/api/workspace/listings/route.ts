import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.BETTER_AUTH_URL ?? request.url).origin;
  if (!origin || origin !== expectedOrigin) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { status: true, creatorProfile: { select: { id: true } } } });
  if (!user || user.status !== "ACTIVE") return NextResponse.json({ error: "This account cannot create listings." }, { status: 403 });
  if (!user.creatorProfile) return NextResponse.json({ error: "A creator profile is required." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid listing details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const price = typeof input.price === "string" || typeof input.price === "number" ? Number(input.price) : NaN;
  if (title.length < 4 || title.length > 90 || summary.length < 10 || summary.length > 180 || description.length < 30 || description.length > 5000 || !Number.isFinite(price) || price < 0 || price > 100000000000) {
    return NextResponse.json({ error: "Check the title, summary, description and MWK price. The description needs at least 30 characters." }, { status: 400 });
  }
  const slugBase = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) || "service";
  try {
    const listing = await prisma.listing.create({ data: {
      creatorId: user.creatorProfile.id, ownerUserId: session.user.id, type: "SERVICE", status: "DRAFT",
      title, summary, description, price, currency: "MWK", slug: slugBase + "-" + randomUUID().slice(0, 8)
    }, select: { id: true, title: true, status: true, createdAt: true } });
    return NextResponse.json({ data: listing }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save this draft. Please try again." }, { status: 500 });
  }
}
