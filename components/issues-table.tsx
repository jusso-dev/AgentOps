"use client";

import { useMemo, useState } from "react";
import type { Issue, Repository, TriageReport } from "@prisma/client";
import { ListChecks, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { TriageReportCard } from "@/components/triage-report-card";
import { EmptyState } from "@/components/empty-state";

type RepositoryWithIssues = Repository & {
  issues: Issue[];
  triageReports: TriageReport[];
};

function parseLabels(labels: string) {
  try {
    const parsed = JSON.parse(labels) as string[];
    return parsed.join(", ");
  } catch {
    return labels;
  }
}

function inferType(issue: Issue) {
  const text = `${issue.title} ${issue.body ?? ""} ${issue.labels}`.toLowerCase();
  if (["security", "vuln", "cve", "auth", "token", "permission"].some((word) => text.includes(word))) return "security";
  if (["bug", "error", "broken", "crash", "failing", "exception"].some((word) => text.includes(word))) return "bug";
  if (["docs", "readme", "documentation"].some((word) => text.includes(word))) return "documentation";
  if (["refactor", "cleanup", "technical debt"].some((word) => text.includes(word))) return "refactor";
  if (["feature", "add", "support", "request"].some((word) => text.includes(word))) return "feature";
  return "task";
}

export function IssuesTable({ repositories }: { repositories: RepositoryWithIssues[] }) {
  const [repositoryId, setRepositoryId] = useState(repositories[0]?.id ?? "");
  const [state, setState] = useState("all");
  const [type, setType] = useState("all");
  const [reports, setReports] = useState<TriageReport[]>(
    repositories.find((repository) => repository.id === repositoryId)?.triageReports ?? [],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedRepository = repositories.find((repository) => repository.id === repositoryId);

  const issues = useMemo(() => {
    return (selectedRepository?.issues ?? []).filter((issue) => {
      const stateMatches = state === "all" || issue.state === state;
      const typeMatches = type === "all" || inferType(issue) === type;
      return stateMatches && typeMatches;
    });
  }, [selectedRepository, state, type]);

  async function runTriage() {
    if (!selectedRepository) return;
    setIsLoading(true);
    setMessage(null);

    const response = await fetch(`/api/repositories/${selectedRepository.id}/triage`, {
      method: "POST",
    });
    const payload = (await response.json()) as { error?: string; reports?: TriageReport[] };
    setIsLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Triage failed.");
      return;
    }

    setReports(payload.reports ?? []);
    setMessage(`Generated ${payload.reports?.length ?? 0} triage reports.`);
  }

  if (repositories.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No issues available"
        description="Import a repository first. The triage agent needs stored issue metadata before it can classify type, priority, and risk."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Imported issues</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {issues.length} issue{issues.length === 1 ? "" : "s"} shown from {selectedRepository?.fullName}.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[34rem]">
              <Select
                value={repositoryId}
                onValueChange={(value) => {
                  setRepositoryId(value);
                  setReports(repositories.find((repository) => repository.id === value)?.triageReports ?? []);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Repository" />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repository) => (
                    <SelectItem key={repository.id} value={repository.id}>
                      {repository.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="refactor">Refactor</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={runTriage} disabled={isLoading}>
              <Wand2 />
              {isLoading ? "Running triage" : "Triage Issues"}
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Labels</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{issue.number}</TableCell>
                  <TableCell className="max-w-[30rem]">
                    <div className="truncate font-medium">{issue.title}</div>
                    {issue.author ? <div className="mt-1 text-xs text-muted-foreground">Opened by {issue.author}</div> : null}
                  </TableCell>
                  <TableCell><StatusBadge value={issue.state} /></TableCell>
                  <TableCell><StatusBadge value={inferType(issue)} /></TableCell>
                  <TableCell className="max-w-72 truncate text-muted-foreground">{parseLabels(issue.labels)}</TableCell>
                </TableRow>
              ))}
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No issues match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold">Generated triage reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reports are persisted locally and regenerated from imported issue metadata.
          </p>
        </div>
        {reports.length > 0 ? reports.map((report) => <TriageReportCard key={report.id} report={report} />) : (
          <EmptyState
            icon={Wand2}
            title="No triage reports yet"
            description="Run triage to generate persisted issue summaries, suggested labels, risk level, and implementation guidance."
          />
        )}
      </section>
    </div>
  );
}
