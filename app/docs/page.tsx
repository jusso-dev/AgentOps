import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { BookOpen, Bot, Database, FileCode2, GitBranch, ServerCog } from "lucide-react";

const docs = [
  {
    title: "AGENTS.md",
    icon: Bot,
    copy: "Codex reads AGENTS.md for repository-specific instructions. This project uses it to define architecture, workflow, safety rules, commands, and agent roles.",
  },
  {
    title: "CLAUDE.md",
    icon: FileCode2,
    copy: "Claude Code users get the same operational map: commands, architecture boundaries, where GitHub API logic lives, and how to review changes.",
  },
  {
    title: "MCP servers",
    icon: ServerCog,
    copy: "The example MCP configs show how GitHub, filesystem, SQLite, and browser/search tools can provide bounded context to coding agents.",
  },
  {
    title: "Local simulation",
    icon: Database,
    copy: "Agent outputs are deterministic for the MVP. Triage and changelog modules use transparent keyword rules and can be replaced with an LLM provider later.",
  },
  {
    title: "LLM integration point",
    icon: GitBranch,
    copy: "A production provider belongs behind lib/agents, preserving route contracts and UI behavior while adding model calls, prompt templates, and evaluation.",
  },
];

export default function DocsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Repository artifact"
        title="Docs"
        description="The app doubles as a repository artifact for demonstrating agent-ready development practices."
        icon={BookOpen}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
