import Link from "next/link";
import type { Repository } from "@prisma/client";
import { ExternalLink, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";

export function RepositoryList({
  repositories,
}: {
  repositories: Array<Repository & { _count?: { issues: number; pullRequests: number; commits: number; releases: number } }>;
}) {
  if (repositories.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title="No repositories imported"
        description="Import a public repository to populate issues, pull requests, commits, and releases for the local agent workflows."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {repositories.map((repository) => (
        <Card key={repository.id} className="transition-[border-color,box-shadow] duration-200 hover:border-primary/30">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{repository.fullName}</CardTitle>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                {repository.description ?? "No description returned by GitHub."}
              </p>
            </div>
            {repository.url ? (
              <Button asChild variant="outline" size="sm">
                <a href={repository.url} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  GitHub
                </a>
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{repository._count?.issues ?? 0} issues</Badge>
              <Badge variant="outline">{repository._count?.pullRequests ?? 0} PRs</Badge>
              <Badge variant="outline">{repository._count?.commits ?? 0} commits</Badge>
              <Badge variant="outline">{repository._count?.releases ?? 0} releases</Badge>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/issues">Triage</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/changelog">Changelog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
