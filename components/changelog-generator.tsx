"use client";

import { useState } from "react";
import type { Changelog, Repository } from "@prisma/client";
import { CalendarDays, GitPullRequest } from "lucide-react";
import { ChangelogPreview } from "@/components/changelog-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";

type RepositoryWithChangelogs = Repository & { changelogs: Changelog[] };

export function ChangelogGenerator({ repositories }: { repositories: RepositoryWithChangelogs[] }) {
  const [repositoryId, setRepositoryId] = useState(repositories[0]?.id ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [markdown, setMarkdown] = useState(repositories[0]?.changelogs[0]?.markdown ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function generate() {
    if (!repositoryId) return;
    setIsLoading(true);
    setMessage(null);

    const response = await fetch(`/api/repositories/${repositoryId}/changelog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      }),
    });

    const payload = (await response.json()) as { error?: string; changelog?: Changelog };
    setIsLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Changelog generation failed.");
      return;
    }

    setMarkdown(payload.changelog?.markdown ?? "");
    setMessage("Changelog generated and saved locally.");
  }

  if (repositories.length === 0) {
    return (
      <EmptyState
        icon={GitPullRequest}
        title="No changelog source data"
        description="Import a repository first so commits and pull requests are available for release-note grouping."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Generate changelog</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Leave dates blank to use the last seven days.
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
            <div className="grid gap-2">
              <Label>Repository</Label>
              <Select
                value={repositoryId}
                onValueChange={(value) => {
                  setRepositoryId(value);
                  setMarkdown(repositories.find((repository) => repository.id === value)?.changelogs[0]?.markdown ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repository) => (
                    <SelectItem key={repository.id} value={repository.id}>
                      {repository.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </div>
            <Button onClick={generate} disabled={isLoading}>
              <CalendarDays />
              {isLoading ? "Generating" : "Generate Changelog"}
            </Button>
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
      </Card>
      {markdown ? <ChangelogPreview markdown={markdown} /> : null}
    </div>
  );
}
