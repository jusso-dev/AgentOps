# Claude Code Guide

## Project Overview

AgentOps Playground is a local-first Next.js portfolio app for demonstrating AI-agent-native development. It imports GitHub repository data into SQLite, then generates deterministic issue triage reports and changelog markdown.

## Commands

```bash
npm install
npm run db:push
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Architecture Boundaries

- Pages and API routes live in `app/`.
- UI components live in `components/`.
- GitHub import logic belongs in `lib/github.ts`.
- Request validation belongs in `lib/validators.ts`.
- Prisma access uses `lib/prisma.ts`.
- Agent simulation and future LLM-provider boundaries belong in `lib/agents/`.
- Documentation artifacts live in `docs/`, `examples/`, `.mcp/`, `AGENTS.md`, and this file.

## Coding Conventions

- Keep TypeScript strict.
- Use Zod for request validation.
- Return clean API errors without stack traces.
- Keep tokens request-scoped. Do not store tokens in SQLite, localStorage, logs, or generated markdown.
- Treat `GITHUB_TOKEN` as local-development fallback only; it is disabled in production.
- Keep public production access disabled unless authentication is added.
- Prefer server-side data fetching for dashboard pages.
- Use client components only for forms, filtering, copying, and interactive generation.

## GitHub API Logic

All Octokit usage should stay in `lib/github.ts`. The import flow supports public unauthenticated requests, optional `GITHUB_TOKEN`, and optional request-scoped tokens from the UI.

## Agent Simulation Logic

Keep deterministic rules in:

- `lib/agents/triage-agent.ts`
- `lib/agents/changelog-agent.ts`
- `lib/agents/review-agent.ts`
- `lib/agents/implementation-plan-agent.ts`

If a real LLM provider is added, preserve the API route contracts and keep provider-specific code behind these modules.

## Updating Docs

Update docs when behavior, setup, security posture, or workflow contracts change. Update examples when generated output changes.

## Review Checklist

- Does the change keep the app runnable locally?
- Are request bodies validated?
- Are GitHub tokens never stored or logged?
- Are database changes intentional and safe?
- Are user-facing errors clear?
- Were lint, typecheck, and build run where relevant?
