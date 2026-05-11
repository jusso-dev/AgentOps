# Agent Workflows

The project models a structured multi-agent workflow:

```txt
Planner Agent -> Implementation Agent -> Review Agent -> Documentation Agent
```

## Planner Agent

Reads imported issues and creates scoped implementation plans, risks, labels, and next actions.

## Implementation Agent

Makes the smallest safe change, follows repo instructions, and keeps secrets out of logs and persistence.

## Review Agent

Prioritizes correctness, regressions, security constraints, and missing validation.

## Documentation Agent

Updates README, examples, workflow docs, and setup docs after behavior changes.

## Security Agent

Reviews token handling, MCP permissions, API input validation, and database safety.
