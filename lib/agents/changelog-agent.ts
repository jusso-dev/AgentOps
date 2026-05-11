import type { Commit, PullRequest, Repository } from "@prisma/client";
const sections = [
  "New Features",
  "Improvements",
  "Fixes",
  "Security",
  "Documentation",
  "Maintenance",
] as const;

type Section = (typeof sections)[number];

function classify(message: string): Section {
  const text = message.toLowerCase();
  if (["security", "vuln", "cve", "auth", "token", "permission"].some((word) => text.includes(word))) return "Security";
  if (["fix", "bug", "error", "crash", "failing", "exception"].some((word) => text.includes(word))) return "Fixes";
  if (["docs", "readme", "documentation"].some((word) => text.includes(word))) return "Documentation";
  if (["feature", "add", "support", "request"].some((word) => text.includes(word))) return "New Features";
  if (["refactor", "cleanup", "chore", "deps", "dependency", "technical debt"].some((word) => text.includes(word))) return "Maintenance";
  return "Improvements";
}

function firstLine(value: string) {
  return value.split("\n")[0]?.trim() || "Untitled change";
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function generateChangelog({
  repository,
  commits,
  pullRequests,
  startDate,
  endDate,
}: {
  repository: Repository;
  commits: Commit[];
  pullRequests: PullRequest[];
  startDate: Date;
  endDate: Date;
}) {
  const grouped = new Map<Section, string[]>(sections.map((section) => [section, []]));

  for (const pullRequest of pullRequests) {
    grouped.get(classify(pullRequest.title))?.push(`- ${pullRequest.title} (#${pullRequest.number})`);
  }

  for (const commit of commits) {
    grouped.get(classify(commit.message))?.push(`- ${firstLine(commit.message)} (${commit.sha.slice(0, 7)})`);
  }

  const lines = [
    "# Weekly Changelog",
    "",
    `Generated for \`${repository.fullName}\` from ${formatDate(startDate)} to ${formatDate(endDate)}.`,
    "",
  ];

  for (const section of sections) {
    const items = grouped.get(section) ?? [];
    if (items.length === 0) continue;
    lines.push(`## ${section}`, "", ...items, "");
  }

  if (lines.length === 4) {
    lines.push("No commits or pull requests were found in this date range.", "");
  }

  return lines.join("\n").trimEnd();
}
