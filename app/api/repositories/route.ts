import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const repositories = await prisma.repository.findMany({
      orderBy: { importedAt: "desc" },
      include: {
        _count: {
          select: {
            issues: true,
            pullRequests: true,
            commits: true,
            releases: true,
            triageReports: true,
            changelogs: true,
          },
        },
      },
    });

    return NextResponse.json({ repositories });
  } catch {
    return NextResponse.json({ error: "Unable to load repositories." }, { status: 500 });
  }
}
