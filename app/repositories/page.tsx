import { prisma } from "@/lib/prisma";
import { RepositoryImportForm } from "@/components/repository-import-form";
import { RepositoryList } from "@/components/repository-list";
import { PageHeader } from "@/components/page-header";
import { GitBranch } from "lucide-react";

export default async function RepositoriesPage() {
  const repositories = await prisma.repository.findMany({
    orderBy: { importedAt: "desc" },
    include: {
      _count: {
        select: {
          issues: true,
          pullRequests: true,
          commits: true,
          releases: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="GitHub import"
        title="Repositories"
        description="Import recent GitHub issues, pull requests, commits, labels, and releases into the local SQLite database."
        icon={GitBranch}
      />
      <RepositoryImportForm />
      <RepositoryList repositories={repositories} />
    </div>
  );
}
