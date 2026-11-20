import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "Catalogue is temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim();

  if (category && (!/^[a-z0-9][a-z0-9 -]{0,39}$/i.test(category))) {
    return Response.json(
      { error: "Invalid category filter." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const tools = await prisma.digitalTool.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category: { equals: category, mode: "insensitive" as const } } : {}),
        supplier: { is: { status: "ACTIVE" } },
        plans: { some: { isActive: true } },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      take: 100,
      select: {
        id: true,
        slug: true,
        name: true,
        vendorName: true,
        category: true,
        shortDescription: true,
        description: true,
        officialProductUrl: true,
        supportUrl: true,
        supportedCountries: true,
        plans: {
          where: { isActive: true },
          orderBy: [{ billingInterval: "asc" }, { name: "asc" }],
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            billingInterval: true,
            termDays: true,
            currency: true,
            price: true,
          },
        },
      },
    });

    return Response.json(
      {
        data: tools.map((tool) => ({
          ...tool,
          plans: tool.plans.map((plan) => ({
            ...plan,
            price: plan.price.toString(),
          })),
        })),
        meta: { count: tools.length, limit: 100 },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch {
    return Response.json(
      { error: "Catalogue is temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
}
