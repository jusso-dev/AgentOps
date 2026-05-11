# AgentOps Playground Agent Instructions

## Purpose

AgentOps Playground demonstrates AI-agent-native development workflows in a real local-first app. The repo should stay easy to run, safe with secrets, and clear for portfolio review.

## Architecture

- `app/` contains Next.js pages and API routes.
- `components/` contains reusable UI components.
- `lib/github.ts` owns GitHub API import behavior.
- `lib/agents/` owns deterministic local agent simulation.
- `lib/validators.ts` owns Zod request validation.
- `lib/prisma.ts` owns Prisma client setup.
- `prisma/schema.prisma` owns the SQLite data model.
- `docs/`, `examples/`, and `.mcp/` are part of the portfolio artifact.

## Required Workflow

1. Understand the task.
2. Inspect relevant files.
3. Make a small plan.
4. Implement the smallest safe change.
5. Run lint/typecheck/tests where relevant.
6. Review for security and maintainability.
7. Update docs or examples if behaviour changed.
8. Summarise changes clearly.

## Agent Roles

- Planner Agent: converts issues into scoped implementation plans, risks, and acceptance criteria.
- Implementation Agent: changes code within the agreed boundary and keeps the app runnable.
- Review Agent: looks for bugs, regressions, missing tests, and maintainability issues.
- Documentation Agent: updates README, docs, examples, and workflow notes.
- Security Agent: checks secret handling, token flow, input validation, and database safety.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:push
npm run db:studio
```

## Coding Standards

- Keep TypeScript strict and avoid `any`.
- Validate external input with Zod.
- Keep GitHub API code in `lib/github.ts`.
- Keep deterministic agent rules in `lib/agents/`.
- Prefer small, readable modules over broad abstractions.
- Keep UI components responsive and accessible.
- Use server components for data loading unless client interactivity is required.

## Testing Expectations

- Run `npm run lint` after code changes.
- Run `npm run typecheck` after TypeScript changes.
- Run `npm run build` before considering the app complete.
- Add focused tests if behavior grows beyond simple deterministic rules.

## Security Rules

- Never log secrets.
- Never commit `.env`.
- Never store GitHub tokens.
- Validate external input.
- Handle GitHub API rate limits and errors.
- Avoid destructive database changes without explicit approval.
- Do not expose stack traces through API responses.
- Keep the production deployment local-first unless authentication is added.
- Pin external MCP server package versions before using examples in a real workflow.

## What Not To Do

- Do not add authentication, billing, background jobs, or Docker before the MVP is complete.
- Do not replace deterministic local simulation with a required paid LLM call.
- Do not widen filesystem, GitHub, or database permissions in MCP examples without documenting the risk.
- Do not hide token handling inside client storage.
