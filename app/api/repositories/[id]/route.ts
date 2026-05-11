import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const repository = await prisma.repository.findUnique({
      where: { id },
      include: {
        issues: { orderBy: { updatedAt: "desc" } },
        pullRequests: { orderBy: { updatedAt: "desc" } },
        commits: { orderBy: { committedAt: "desc" } },
        releases: { orderBy: { publishedAt: "desc" } },
        triageReports: { orderBy: { createdAt: "desc" } },
        changelogs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!repository) {
      return NextResponse.json({ error: "Repository not found." }, { status: 404 });
    }

    return NextResponse.json({ repository });
  } catch {
    return NextResponse.json({ error: "Unable to load repository data." }, { status: 500 });
  }
}
