import { prisma } from "@/lib/prisma";
import { ChangelogGenerator } from "@/components/changelog-generator";
import { PageHeader } from "@/components/page-header";
import { GitPullRequest } from "lucide-react";

export default async function ChangelogPage() {
  const repositories = await prisma.repository.findMany({
    orderBy: { importedAt: "desc" },
    include: {
      changelogs: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Markdown output"
        title="Changelog"
        description="Generate copyable markdown from imported commits and pull requests, grouped into release-note sections."
        icon={GitPullRequest}
      />
      <ChangelogGenerator repositories={repositories} />
    </div>
  );
}
