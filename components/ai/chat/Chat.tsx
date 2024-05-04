"use client";

import { useChat } from "ai/react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import MessageList from "@/components/ai/chat/MessageList";

type ChatProps = {
  endpoint: string;
};
const Chat = ({ endpoint }: ChatProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: endpoint, // change depending on the api route you want to toggle
      // body: {
      //   chatId,
      // },
      // initialMessages: data || [],
    });

  return (
    <main className="relative h-[40rem] rounded-lg border border-secondary p-4">
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
};

export default Chat;
