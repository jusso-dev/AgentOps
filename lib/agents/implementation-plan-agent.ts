export function generateImplementationPlan(goal: string) {
  return [
    `Clarify the target outcome: ${goal}`,
    "Inspect the smallest relevant module boundary.",
    "Add or update focused tests before broad refactors.",
    "Implement the smallest safe behavior change.",
    "Run validation and update docs or examples if behavior changed.",
  ];
}
