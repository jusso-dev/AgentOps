import { Badge } from "@/components/ui/badge";

const levelMap = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  open: "success",
  closed: "secondary",
  security: "critical",
  bug: "warning",
  documentation: "low",
  docs: "low",
  refactor: "info",
  feature: "medium",
  task: "secondary",
} as const;

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const variant = normalized in levelMap ? levelMap[normalized as keyof typeof levelMap] : "secondary";

  return <Badge variant={variant}>{value}</Badge>;
}
