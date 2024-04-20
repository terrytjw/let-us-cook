"use client";

import { useChat } from "ai/react";
import useAutoScroll from "@/hooks/useAutoScroll";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/Icons";
import MessageList from "@/components/ai/MessageList";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat", // change depending on the api route you want to toggle
      // body: {
      //   chatId,
      // },
      // initialMessages: data || [],
    });

  useAutoScroll("message-container", [messages]);

  console.log("messages ->", messages);

  return (
    <ScrollArea className="relative rounded p-4" id="message-container">
      <MessageList messages={messages} isLoading={isLoading} />

      <form onSubmit={handleSubmit} className="sticky bottom-0 px-2 py-4">
        <div className="relative">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Start chatting..."
            className="h-14 w-full"
          />
          <Button
            className="absolute bottom-3 right-3"
            size="sm"
            disabled={!input.trim()}
          >
            <Icons.send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
