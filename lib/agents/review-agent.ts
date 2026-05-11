export function generateReviewChecklist() {
  return [
    "Does the change satisfy the issue acceptance criteria?",
    "Are external inputs validated before use?",
    "Could the change log secrets or persist tokens?",
    "Are failure states handled without stack traces?",
    "Were lint, typecheck, and focused tests run where relevant?",
  ];
}
