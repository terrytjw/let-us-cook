import React from "react";
import { Message as VercelChatMessage } from "ai";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatScrollAnchor } from "./ChatScrollAnchor";

type MessageListProps = {
  messages: VercelChatMessage[];
  isLoading: boolean;
};
const MessageList = ({ messages, isLoading }: MessageListProps) => {
  if (messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        <p className="py-4 tracking-wider text-gray-500">
          What's on your mind?
        </p>
      </div>
    );

  return (
    <ScrollArea className="h-[35rem] rounded p-4">
      <div className="mb-4 flex flex-col gap-2 px-4">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn("flex", {
                "justify-end pl-10": message.role === "user",
                "justify-start pr-10": message.role === "assistant",
              })}
            >
              <div
                className={cn(
                  "rounded-lg px-3 py-1 text-sm shadow-md ring-1 ring-gray-900/10",
                  {
                    "bg-primary": message.role === "user",
                    "bg-secondary": message.role === "assistant",
                  },
                )}
              >
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ChatScrollAnchor trackVisibility={isLoading} />
    </ScrollArea>
  );
};

export default MessageList;
