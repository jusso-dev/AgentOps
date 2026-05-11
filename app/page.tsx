import { Bot, CheckCircle2, FileText, GitBranch, GitPullRequest, ListChecks, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";

export default async function DashboardPage() {
  const [repositories, issues, pullRequests, triageReports, changelogs] = await Promise.all([
    prisma.repository.count(),
    prisma.issue.count(),
    prisma.pullRequest.count(),
    prisma.triageReport.count(),
    prisma.changelog.count(),
  ]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-lg border bg-card/96 p-6 shadow-[0_1px_2px_oklch(0.18_0.02_249/0.06),0_18px_42px_oklch(0.18_0.02_249/0.06)] sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              <Bot className="size-4" />
              Local-first agent workflow lab
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
              AgentOps Playground
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Import GitHub data, generate deterministic triage reports, build changelogs, and show how coding agents can work inside clear repo rules.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/repositories">Import a repository</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workflows">View workflows</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <CheckCircle2 className="size-5" />
              </div>
              <CardTitle>Quick start</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 text-sm leading-6 text-muted-foreground">
              {[
                "Open Repositories and enter an owner/repo GitHub target.",
                "Add a token only when the repo is private or rate-limited.",
                "Run issue triage, then generate a weekly changelog.",
                "Use Docs to review AGENTS.md, CLAUDE.md, and MCP boundaries.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-foreground">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardCard title="Repositories" value={repositories} description="Imported locally" icon={GitBranch} />
        <DashboardCard title="Issues" value={issues} description="Ready for triage" icon={ListChecks} />
        <DashboardCard title="Pull requests" value={pullRequests} description="Available for release notes" icon={GitPullRequest} />
        <DashboardCard title="Triage reports" value={triageReports} description="Generated locally" icon={Bot} />
        <DashboardCard title="Changelogs" value={changelogs} description="Saved markdown outputs" icon={FileText} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Safe tool boundaries", "Tokens are used only during import and are never persisted in SQLite."],
          ["Deterministic agents", "The MVP simulates agent behavior with transparent rules rather than paid LLM calls."],
          ["Portfolio-ready docs", "AGENTS.md, CLAUDE.md, MCP examples, and workflow docs are part of the demo."],
        ].map(([title, copy], index) => (
          <Card key={title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  {index === 0 ? <ShieldCheck className="size-4" /> : <FileText className="size-4" />}
                </div>
                <CardTitle>{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{copy}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
