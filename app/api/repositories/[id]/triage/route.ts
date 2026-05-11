import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTriageReports } from "@/lib/agents/triage-agent";

const priorityRank: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortReportsByPriority<T extends { priority: string; createdAt: Date }>(reports: T[]) {
  return [...reports].sort((a, b) => {
    const rankA = priorityRank[a.priority] ?? 99;
    const rankB = priorityRank[b.priority] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const reports = await prisma.triageReport.findMany({
      where: { repositoryId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports: sortReportsByPriority(reports) });
  } catch {
    return NextResponse.json({ error: "Unable to load triage reports." }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const repository = await prisma.repository.findUnique({
      where: { id },
      include: { issues: { orderBy: { updatedAt: "desc" } } },
    });

    if (!repository) {
      return NextResponse.json({ error: "Repository not found." }, { status: 404 });
    }

    if (repository.issues.length === 0) {
      return NextResponse.json({ error: "No imported issues are available for triage." }, { status: 400 });
    }

    const reports = generateTriageReports(repository.issues);

    await prisma.$transaction([
      prisma.triageReport.deleteMany({ where: { repositoryId: id } }),
      prisma.triageReport.createMany({
        data: reports.map((report) => ({
          ...report,
          repositoryId: id,
        })),
      }),
    ]);

    const savedReports = await prisma.triageReport.findMany({
      where: { repositoryId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports: sortReportsByPriority(savedReports) });
  } catch {
    return NextResponse.json({ error: "Unable to generate triage reports." }, { status: 500 });
  }
}
