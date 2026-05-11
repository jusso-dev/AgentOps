import type { Issue } from "@prisma/client";

const typeRules = [
  { type: "security", keywords: ["security", "vuln", "cve", "auth", "token", "permission"] },
  { type: "bug", keywords: ["bug", "error", "broken", "crash", "failing", "exception"] },
  { type: "documentation", keywords: ["docs", "readme", "documentation"] },
  { type: "refactor", keywords: ["refactor", "cleanup", "technical debt"] },
  { type: "feature", keywords: ["feature", "add", "support", "request"] },
];

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyType(text: string) {
  return typeRules.find((rule) => includesAny(text, rule.keywords))?.type ?? "task";
}

function classifyPriority(type: string, text: string) {
  if (type === "security" || text.includes("data loss")) return "critical";
  if (type === "bug" && includesAny(text, ["crash", "failing", "auth"])) return "high";
  if (type === "feature" || type === "refactor") return "medium";
  if (type === "documentation") return "low";
  return "medium";
}

function classifyRisk(text: string) {
  if (includesAny(text, ["security", "auth", "database", "migration", "payment"])) return "high";
  if (includesAny(text, ["api", "backend", "data model"])) return "medium";
  if (includesAny(text, ["ui", "docs", "copy"])) return "low";
  return "medium";
}

export function generateTriageReport(issue: Issue) {
  const text = `${issue.title} ${issue.body ?? ""} ${issue.labels}`.toLowerCase();
  const type = classifyType(text);
  const priority = classifyPriority(type, text);
  const risk = classifyRisk(text);
  const suggestedLabels = Array.from(new Set([type, `priority:${priority}`, `risk:${risk}`]));

  return {
    issueNumber: issue.number,
    issueTitle: issue.title,
    type,
    priority,
    risk,
    suggestedLabels: suggestedLabels.join(", "),
    summary: `Classified as ${type} with ${priority} priority based on title, body, and labels.`,
    nextAction:
      priority === "critical"
        ? "Assign an owner immediately and verify impact before implementation."
        : "Confirm reproduction details, scope the change, and attach acceptance criteria.",
    implementationPlan: [
      "Inspect related code paths",
      "write or update focused tests",
      "make a minimal implementation",
      "run validation commands",
      "document user-facing changes",
    ].join("; "),
  };
}

export function generateTriageReports(issues: Issue[]) {
  return issues.map(generateTriageReport);
}
