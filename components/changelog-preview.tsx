import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

export function ChangelogPreview({ markdown }: { markdown: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Generated markdown</CardTitle>
        <CopyButton value={markdown} />
      </CardHeader>
      <CardContent>
        <pre className="max-h-[34rem] overflow-auto rounded-md border bg-secondary/65 p-4 text-sm leading-6 shadow-inner">
          <code>{markdown}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
