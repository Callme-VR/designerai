"use client";

import { getHTMLWrapper } from "@/lib/frame-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CodeBlock, CodeBlockCopyButton } from "../ai-elements/code-block";

export default function HtmlDialog({
  open,
  title,
  html,
  onOpenChange,
  theme_style,
}: {
  open: boolean;
  title: string;
  html: string;
  onOpenChange: (value: boolean) => void;
  theme_style?: string;
}) {
  const fullhtml = getHTMLWrapper(html, title, theme_style);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title || "undeined"}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-full overflow-y-auto">
          <div>
            <CodeBlock
              className="w-full h-auto"
              code={fullhtml}
              language="html"
              showLineNumbers={true}
            >
              <CodeBlockCopyButton className=" fixed top-16 right-12 z-50 bg-muted" />
            </CodeBlock>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
