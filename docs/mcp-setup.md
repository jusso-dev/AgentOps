# MCP Setup

These examples are illustrative placeholders. Verify exact MCP package names, arguments, and config formats for your installed client.

For real use, pin MCP package versions where possible instead of running unpinned `npx -y` commands. Treat MCP server configuration as executable supply-chain surface.

## GitHub MCP Server

Used for issue, pull request, repository, and release context. It should have only the GitHub permissions required for the repositories being inspected.

Risk: broad repository tokens can expose private code and issues. Use least-privilege tokens and avoid write scopes unless a workflow explicitly needs them.

Project fit: agents can inspect issues and pull requests before planning implementation.

## Filesystem MCP Server

Used for local repository file context. Limit access to this project directory when possible.

Risk: broad filesystem access can expose unrelated local files or secrets.

Project fit: agents can read code, docs, examples, and local configuration before editing.

## SQLite MCP Server

Used for read-only inspection of imported repository data during analysis.

Risk: write access can corrupt local state. Prefer read-only access for review and planning workflows.

Project fit: agents can query imported issues, commits, and generated reports.

## Browser/Search MCP Server

Used for external documentation lookup, GitHub documentation, package documentation, and current implementation references.

Risk: search output can be stale, low quality, or prompt-injection prone. Prefer primary sources and keep browser tools read-only.

Project fit: agents can confirm APIs and ecosystem details while keeping implementation local.
