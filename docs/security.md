# Security

## Token Handling

- GitHub tokens are optional.
- Tokens can come from `GITHUB_TOKEN` or the import form.
- Tokens are used only during the import request.
- Tokens are never stored in SQLite.
- Tokens must never be logged.
- `GITHUB_TOKEN` fallback is disabled in production; production imports should use request-scoped pasted tokens unless authentication is added.

## Deployment Boundary

AgentOps Playground is local-first. In production, requests from non-local hosts are blocked unless `AGENTOPS_ALLOW_PUBLIC_ACCESS=true` is set. Do not enable public access with private repository data unless authentication and access controls have been added.

## Input Validation

Repository names must match `owner/repo` format. API request bodies are validated with Zod before use.

## Error Handling

API routes return user-safe error messages for invalid repositories, missing permissions, GitHub API failures, rate limits, empty data, and database failures. Stack traces should not be exposed to users.

## MCP Boundaries

MCP servers should run with least privilege. Prefer read-only database and browser/search access for planning and review workflows.

Pin MCP package versions where possible. Unpinned `npx -y` examples are illustrative only and should be verified before use.
