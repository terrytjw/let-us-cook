"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "@/lib/code-gen/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMessage from "@/components/ai/code-gen/UserMessage";
import { Icons } from "@/components/Icons";

const FollowupPanel = () => {
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const { submitUserInput } = useActions<typeof AI>();
  const [, setMessages] = useUIState<typeof AI>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} isFirstMessage={false} />,
    };

    const responseMessage = await submitUserInput(formData);

    if (responseMessage.errorOccurred) {
      console.error("Error occurred during GenUI process.");
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      responseMessage,
    ]);

    setInput("");
    queryClient.invalidateQueries({ queryKey: ["ai-credits"] });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-1"
    >
      <Input
        autoComplete="off"
        type="text"
        name="input"
        placeholder="Got some other ideas? Fire away."
        value={input}
        className="h-12 pr-14"
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        type="submit"
        size={"icon"}
        disabled={input.length === 0}
        variant={"ghost"}
        className="absolute right-1"
      >
        <Icons.arrowRight size={20} />
      </Button>
    </form>
  );
};

export default FollowupPanel;
