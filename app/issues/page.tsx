import { prisma } from "@/lib/prisma";
import { IssuesTable } from "@/components/issues-table";
import { PageHeader } from "@/components/page-header";
import { ListChecks } from "lucide-react";

export default async function IssuesPage() {
  const repositories = await prisma.repository.findMany({
    orderBy: { importedAt: "desc" },
    include: {
      issues: { orderBy: { updatedAt: "desc" } },
      triageReports: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Local agent simulator"
        title="Issue triage"
        description="Generate structured local triage outputs with priority, risk, labels, next action, and implementation summary."
        icon={ListChecks}
      />
      <IssuesTable repositories={repositories} />
    </div>
  );
}
