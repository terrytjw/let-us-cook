import React from "react";
import { Message as VercelChatMessage } from "ai";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/Icons";

type MessageListProps = {
  messages: VercelChatMessage[];
  isLoading: boolean;
};
const MessageList = ({ messages, isLoading }: MessageListProps) => {
  console.log("messages -> ", messages);
  if (messages.length === 0)
    return (
      <p className="p-4 tracking-wider text-gray-500">What's on your mind?</p>
    );

  return (
    <div className="flex flex-col gap-2 px-4">
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
      {isLoading && (
        <div className="mt-4 flex items-center gap-2">
          <Icons.loading className="h-4 w-4 animate-spin" /> Assistant is
          thinking...
        </div>
      )}
    </div>
  );
};

export default MessageList;
