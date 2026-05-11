import { z } from "zod";

export const repositoryInputSchema = z.object({
  repository: z
    .string()
    .trim()
    .max(200, "Repository name is too long.")
    .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, "Use owner/repo format."),
  token: z.string().trim().max(500, "Token is too long.").optional(),
});

export const changelogInputSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export function splitRepository(fullName: string) {
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
}
