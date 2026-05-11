# Architecture

AgentOps Playground is a local-first Next.js app with SQLite persistence.

## Runtime Shape

- Next.js app router renders the dashboard and workflow pages.
- API routes import GitHub data and generate persisted local outputs.
- Prisma stores repositories, issues, pull requests, commits, releases, triage reports, and changelogs.
- Octokit fetches GitHub data during a user-triggered import request.
- Deterministic agent modules transform stored data into structured reports.

## Boundaries

- `lib/github.ts`: GitHub API calls and import persistence.
- `lib/agents/`: deterministic agent output generation.
- `app/api/`: request validation, orchestration, and safe JSON responses.
- `components/`: reusable UI controls and app-specific display components.

## LLM Extension Point

A real model provider can be added behind `lib/agents/` without changing the UI or route contracts. Keep prompts, schemas, model selection, and eval hooks in that boundary.
