import { ArrowRight, ClipboardList, Code2, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const agents = [
  { name: "Planner Agent", icon: ClipboardList, copy: "Turns issues into scoped tasks, constraints, risks, and acceptance criteria." },
  { name: "Implementation Agent", icon: Code2, copy: "Makes the smallest safe code change and keeps boundaries explicit." },
  { name: "Review Agent", icon: ShieldCheck, copy: "Checks correctness, regressions, security posture, and missing tests." },
  { name: "Documentation Agent", icon: FileText, copy: "Updates examples, changelogs, and workflow notes after behavior changes." },
];

export function WorkflowDiagram() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {agents.map((agent, index) => (
        <div key={agent.name} className="relative">
          <Card className="h-full transition-[border-color,box-shadow] duration-200 hover:border-primary/25">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <agent.icon className="size-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <CardTitle>{agent.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{agent.copy}</p>
            </CardContent>
          </Card>
          {index < agents.length - 1 ? (
            <ArrowRight className="absolute -right-5 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground lg:block" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
