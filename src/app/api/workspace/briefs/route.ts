import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.BETTER_AUTH_URL ?? request.url).origin;
  if (!origin || origin !== expectedOrigin) return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { status: true, clientProfile: { select: { id: true } } } });
  if (!user || user.status !== "ACTIVE" || !user.clientProfile) return NextResponse.json({ error: "An active client profile is required." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid brief details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const min = input.budgetMin === "" || input.budgetMin == null ? null : Number(input.budgetMin);
  const max = input.budgetMax === "" || input.budgetMax == null ? null : Number(input.budgetMax);
  if (title.length < 5 || title.length > 100 || description.length < 40 || description.length > 5000 ||
      (min !== null && (!Number.isFinite(min) || min < 0)) || (max !== null && (!Number.isFinite(max) || max < 0)) ||
      (min !== null && max !== null && min > max)) {
    return NextResponse.json({ error: "Check your title, description and budget range. The description needs at least 40 characters." }, { status: 400 });
  }
  try {
    const brief = await prisma.brief.create({ data: {
      clientId: session.user.id, title, description, budgetMin: min, budgetMax: max,
      currency: "MWK", status: "DRAFT"
    }, select: { id: true, title: true, status: true, createdAt: true } });
    return NextResponse.json({ data: brief }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save this brief. Please try again." }, { status: 500 });
  }
}
