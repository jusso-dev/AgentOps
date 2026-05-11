import { NextResponse } from "next/server";
import { importRepositoryData, GitHubImportError } from "@/lib/github";
import { repositoryInputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = repositoryInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const repository = await importRepositoryData(parsed.data.repository, parsed.data.token);
    return NextResponse.json({ repository });
  } catch (error) {
    if (error instanceof GitHubImportError) {
      return NextResponse.json({ error: error.message }, { status: error.status ?? 502 });
    }

    return NextResponse.json({ error: "Repository import failed. Check database access and try again." }, { status: 500 });
  }
}
