# AgentOps Playground

AgentOps Playground is a portfolio project demonstrating AI-agent-native software development workflows using AGENTS.md, CLAUDE.md, MCP server examples, and structured multi-agent automation patterns.

It is a local-first Next.js app that imports GitHub repository data, stores it in SQLite, and generates deterministic AI-ready outputs for issue triage, implementation planning, PR review workflows, and changelog generation.

## What It Showcases

- Practical `AGENTS.md` guidance for Codex
- Practical `CLAUDE.md` guidance for Claude Code
- MCP configuration examples for GitHub, filesystem, SQLite, and browser/search context
- Safe boundaries for tokens, tools, repo access, and database operations
- Deterministic local agent simulators that do not require a paid LLM API
- Modern Next.js 15, TypeScript, Tailwind CSS, Prisma, SQLite, Zod, and Octokit implementation

## Screenshots

Screenshots can be added after running the app locally:

- Dashboard overview
- Repository import flow
- Issue triage reports
- Changelog markdown preview
- Multi-agent workflow page

## Quick Start

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
GITHUB_TOKEN="optional_token_for_local_imports"
AGENTOPS_ALLOW_PUBLIC_ACCESS="false"
```

`GITHUB_TOKEN` is optional and is only used as a convenience fallback during local development. In production, paste a token into the import form for a single request. Tokens are never stored in the database.

`AGENTOPS_ALLOW_PUBLIC_ACCESS` defaults to secure local-first behavior. Production requests from non-local hosts are blocked unless this is explicitly set to `true`.

## Database Setup

Prisma uses SQLite for local development.

```bash
npm run db:push
```

To inspect local data:

```bash
npm run db:studio
```

## Running Locally

```bash
npm run dev
```

For a production local smoke test:

```bash
npm run build
npm run start
```

The app is intentionally local-first. Do not deploy it publicly with private repository data unless you add authentication or explicitly accept the risk by setting `AGENTOPS_ALLOW_PUBLIC_ACCESS=true`.

Validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Importing a Repository

1. Go to `/repositories`.
2. Enter a repository in `owner/repo` format.
3. Paste a GitHub token only if needed.
4. Click **Import Repository Data**.

The app imports repository metadata, recent issues, pull requests, commits, and releases.

## Agent Simulation

The MVP does not call an LLM. It uses deterministic modules under `lib/agents/`:

- `triage-agent.ts` classifies issue type, priority, risk, labels, next action, and implementation plan.
- `changelog-agent.ts` groups commits and pull requests into markdown release sections.
- `review-agent.ts` provides a reusable review checklist.
- `implementation-plan-agent.ts` shows where planning logic belongs.

A real provider can be added later behind the same module boundary.

## MCP Fit

MCP examples live in `.mcp/`, and setup guidance lives in `docs/mcp-setup.md`. The examples are illustrative placeholders; verify exact package names and client config formats for your installed MCP client.

## Repo Structure

```txt
app/                  Next.js pages and API routes
components/           Reusable UI and workflow components
lib/                  Prisma, GitHub import logic, validators, agent simulators
prisma/schema.prisma  SQLite data model
docs/                 Architecture, workflows, security, MCP, demo script
examples/             Sample generated outputs
.mcp/                 MCP server config examples
AGENTS.md             Codex repo-level instructions
CLAUDE.md             Claude Code repo-level instructions
```

## Roadmap

- Export triage reports as markdown
- Export changelogs as files
- Add GitHub label suggestion preview
- Add PR review checklist generation in the UI
- Add repository health score
- Add demo seed data
- Add screenshots
