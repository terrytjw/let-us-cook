"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MemoizedReactMarkdown } from "@/components/Markdown";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>;
}) {
  const [data, error, pending] = useStreamableValue(content);

  // Currently, sometimes error occurs after finishing the stream.
  if (error) return <div>Error</div>;

  return (
    <ScrollArea className="h-96 rounded-md border p-4">
      <MemoizedReactMarkdown
        rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
        remarkPlugins={[remarkGfm]}
        className="prose-sm prose-neutral prose-a:text-accent-foreground/50 text-sm"
      >
        {data}
      </MemoizedReactMarkdown>
    </ScrollArea>
  );
}
