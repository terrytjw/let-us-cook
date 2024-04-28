"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/hooks/useStreamableText";

import { CodeBlock } from "@/components/CodeBlock";
import { Icons } from "@/components/Icons";
import { MemoizedReactMarkdown } from "@/components/Markdown";
import Spinner from "@/components/Spinner";

// Different types of message bubbles.

type UserMessageProps = {
  children: ReactNode;
};
export const UserMessage = ({ children }: UserMessageProps) => {
  return (
    <div className="group relative flex items-start">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <Icons.user />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  );
};

type BotMessageProps = {
  content: string | StreamableValue<string>;
  className?: string;
};
export const BotMessage = ({ content, className }: BotMessageProps) => {
  const text = useStreamableText(content);

  return (
    <div className={cn("group relative flex items-start", className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Icons.openai />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            // TODO: replace any
            code({ node, inline, className, children, ...props }: any) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  );
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
};

type BotCardProps = {
  children: ReactNode;
  showAvatar?: boolean;
};
export const BotCard = ({ children, showAvatar = true }: BotCardProps) => {
  return (
    <div className="group relative flex items-start">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible",
        )}
      >
        <Icons.openai />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
};

type SystemMessageProps = {
  children: ReactNode;
};
export const SystemMessage = ({ children }: SystemMessageProps) => {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
};

type SpinnerMessageProps = {
  message: string;
};
export const SpinnerMessage = ({ message }: SpinnerMessageProps) => {
  return (
    <div className="group relative flex items-center gap-x-2">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Icons.openai />
      </div>

      <Spinner message={message} />
    </div>
  );
};
