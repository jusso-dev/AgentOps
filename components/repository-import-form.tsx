"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownloadCloud, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RepositoryImportForm() {
  const router = useRouter();
  const [repository, setRepository] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatus("Importing repository data from GitHub...");

    const response = await fetch("/api/repositories/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repository, token: token || undefined }),
    });

    const payload = (await response.json()) as { error?: string };
    setIsLoading(false);

    if (!response.ok) {
      setStatus(null);
      setError(payload.error ?? "Import failed.");
      return;
    }

    setStatus("Import complete. Repository data is available below.");
    setToken("");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <DownloadCloud className="size-5" />
          </div>
          <div>
            <CardTitle>Import repository data</CardTitle>
            <CardDescription>
              Use public repositories without a token, or paste a token for private repos. Tokens are never stored.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="grid gap-2">
            <Label htmlFor="repository">Repository</Label>
            <Input
              id="repository"
              placeholder="owner/repo"
              value={repository}
              onChange={(event) => setRepository(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="token">GitHub token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Optional"
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </div>
          </div>
          <div className="flex items-start gap-3 rounded-md border bg-secondary/55 p-3 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Paste a token only for private repositories or rate limits. It is used for this request and is not written to SQLite.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isLoading}>
              <DownloadCloud />
              {isLoading ? "Importing" : "Import Repository Data"}
            </Button>
            {status ? <p className="text-sm text-success">{status}</p> : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
