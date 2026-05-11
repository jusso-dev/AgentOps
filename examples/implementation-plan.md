# Example Implementation Plan

Goal: Add repository import error handling.

1. Inspect `lib/github.ts` and `app/api/repositories/import/route.ts`.
2. Confirm GitHub API status codes for missing repository, rate limit, and rejected token.
3. Add user-safe error messages without exposing stack traces.
4. Keep tokens request-scoped and out of persistence.
5. Run lint, typecheck, build, and a manual import check.
