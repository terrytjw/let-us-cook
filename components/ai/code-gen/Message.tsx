"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MemoizedReactMarkdown } from "@/components/Markdown";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

type BotMessageProps = {
  content: string | StreamableValue<string>;
  size: "sm" | "lg";
};
const BotMessage = ({ content, size = "lg" }: BotMessageProps) => {
  const [data, error, pending] = useStreamableValue(content);

  // Currently, sometimes error occurs after finishing the stream.
  if (error) return <div>Error</div>;

  return (
    <ScrollArea
      className={cn(
        "rounded-md border bg-primary/5 p-4",
        size === "lg" ? "h-96" : "h-48",
      )}
      type="always"
    >
      <MemoizedReactMarkdown
        rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
        remarkPlugins={[remarkGfm]}
        className="prose-sm prose-neutral prose-a:text-accent-foreground/50 text-sm"
      >
        {data}
      </MemoizedReactMarkdown>
    </ScrollArea>
  );
};

export default BotMessage;
