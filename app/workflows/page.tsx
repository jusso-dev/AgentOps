import { WorkflowDiagram } from "@/components/workflow-diagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Workflow } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Structured handoff"
        title="Multi-agent workflows"
        description="AgentOps Playground models a structured handoff from planning through implementation, review, and documentation."
        icon={Workflow}
      />
      <WorkflowDiagram />
      <Card>
        <CardHeader>
          <CardTitle>Workflow contract</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
          <p>Planner Agent defines scope, risks, acceptance criteria, and file areas before implementation starts.</p>
          <p>Implementation Agent changes code within the agreed boundary and avoids storing secrets or widening permissions.</p>
          <p>Review Agent prioritizes bugs, regressions, security gaps, and missing validation over style commentary.</p>
          <p>Documentation Agent updates examples, changelogs, MCP notes, and repo-level instructions when behavior changes.</p>
        </CardContent>
      </Card>
    </div>
  );
}
