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
        className="prose-sm prose-neutral prose-a:text-accent-foreground/50 text-sm"
        rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ol({ children, ...props }) {
            return (
              <ol className="mb-2 last:mb-0" {...props}>
                {children}
              </ol>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul className="mb-2 list-inside list-disc last:mb-0" {...props}>
                {children}
              </ul>
            );
          },
          li({ children, ...props }) {
            return (
              <li className="mb-1 last:mb-0" {...props}>
                {children}
              </li>
            );
          },
        }}
      >
        {data}
      </MemoizedReactMarkdown>
    </ScrollArea>
  );
};

export default BotMessage;
