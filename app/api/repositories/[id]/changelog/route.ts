import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { generateChangelog } from "@/lib/agents/changelog-agent";
import { changelogInputSchema } from "@/lib/validators";

const maxRangeMs = 1000 * 60 * 60 * 24 * 366;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const changelogs = await prisma.changelog.findMany({
      where: { repositoryId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ changelogs });
  } catch {
    return NextResponse.json({ error: "Unable to load changelogs." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = changelogInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
  }

  const endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : new Date();
  const startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : subDays(endDate, 7);

  if (startDate > endDate) {
    return NextResponse.json({ error: "Start date must be before end date." }, { status: 400 });
  }

  if (endDate.getTime() - startDate.getTime() > maxRangeMs) {
    return NextResponse.json({ error: "Date range must be 366 days or less." }, { status: 400 });
  }

  try {
    const repository = await prisma.repository.findUnique({
      where: { id },
    });

    if (!repository) {
      return NextResponse.json({ error: "Repository not found." }, { status: 404 });
    }

    const [commits, pullRequests] = await Promise.all([
      prisma.commit.findMany({
        where: {
          repositoryId: id,
          committedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { committedAt: "desc" },
      }),
      prisma.pullRequest.findMany({
        where: {
          repositoryId: id,
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    if (commits.length === 0 && pullRequests.length === 0) {
      return NextResponse.json({ error: "No commits or pull requests found in that date range." }, { status: 400 });
    }

    const markdown = generateChangelog({ repository, commits, pullRequests, startDate, endDate });
    const title = `Weekly Changelog ${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)}`;
    const existingChangelog = await prisma.changelog.findFirst({
      where: {
        repositoryId: id,
        startDate,
        endDate,
      },
    });

    const changelog = existingChangelog
      ? await prisma.changelog.update({
          where: { id: existingChangelog.id },
          data: {
            title,
            markdown,
          },
        })
      : await prisma.changelog.create({
          data: {
            repositoryId: id,
            title,
            markdown,
            startDate,
            endDate,
          },
        });

    return NextResponse.json({ changelog });
  } catch {
    return NextResponse.json({ error: "Unable to generate changelog." }, { status: 500 });
  }
}
