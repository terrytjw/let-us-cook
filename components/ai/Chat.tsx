"use client";

import { useChat } from "ai/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <main className="relative h-[40rem]">
      <MessageList messages={messages} isLoading={isLoading} />
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 left-0 right-0 w-full px-2 py-4"
      >
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
    </main>
  );
}
