import type { TriageReport } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export function TriageReportCard({ report }: { report: TriageReport }) {
  return (
    <Card className="transition-[border-color,box-shadow] duration-200 hover:border-primary/25">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="leading-snug">
              #{report.issueNumber} {report.issueTitle}
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{report.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={report.type} />
            <StatusBadge value={report.priority} />
            <StatusBadge value={report.risk} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-secondary/55 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Suggested labels</p>
          <p className="mt-1 text-sm">{report.suggestedLabels}</p>
        </div>
        <div className="rounded-md bg-secondary/55 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Next action</p>
          <p className="mt-1 text-sm">{report.nextAction}</p>
        </div>
        <div className="rounded-md bg-secondary/55 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Implementation plan</p>
          <p className="mt-1 text-sm">{report.implementationPlan}</p>
        </div>
      </CardContent>
    </Card>
  );
}
