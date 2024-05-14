"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AI } from "@/lib/code-gen/actions";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMessage from "@/components/ai/code-gen/UserMessage";
import EmptyScreen from "@/components/ai/code-gen/EmptyScreen";
import { Icons } from "@/components/Icons";

const ChatPanel = () => {
  const queryClient = useQueryClient();

  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiMessages, setAiMessages] = useAIState<typeof AI>();
  const { submitUserInput } = useActions<typeof AI>();

  const [input, setInput] = useState("");
  const [isNewButtonPressed, setIsNewButtonPressed] = useState(false);
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear messages if the "New" button is pressed
    if (isNewButtonPressed) {
      handleClear();
      setIsNewButtonPressed(false);
    }

    // Add user message to UI state
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        component: <UserMessage message={input} />,
      },
    ]);

    // Submit and get response message
    const formData = new FormData(e.currentTarget);
    const responseMessage = await submitUserInput(formData);

    if (responseMessage.errorOccurred) {
      console.error("Error occurred during GenUI process.");
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      responseMessage as any,
    ]);

    setInput("");
    queryClient.invalidateQueries({ queryKey: ["ai-credits"] });
  };

  // Clear messages
  const handleClear = () => {
    setIsNewButtonPressed(true);
    setMessages([]);
    setAiMessages([]);
  };

  // Focus on input when the "New" button is pressed
  useEffect(() => {
    if (isNewButtonPressed) {
      inputRef.current?.focus();
      setIsNewButtonPressed(false);
    }
  }, [isNewButtonPressed]);

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus();
  }, []);

  // listen for cmd + k to focus input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // If there are messages and the "New" button has not been pressed, display the New Button
  if (messages.length > 0 && !isNewButtonPressed) {
    return (
      <div className="pointer-events-none fixed bottom-2 left-0 right-0 z-20 mx-auto flex items-center justify-center md:bottom-8">
        <Button
          type="button"
          variant={"secondary"}
          className="group pointer-events-auto rounded-full bg-secondary/80 transition-all hover:scale-105"
          onClick={() => handleClear()}
        >
          <span className="mr-2 hidden text-sm duration-300 animate-in fade-in group-hover:block">
            New
          </span>
          <Icons.plus
            size={18}
            className="transition-all group-hover:rotate-90"
          />
        </Button>
      </div>
    );
  }

  // this component is not rendered if there are messages
  return (
    <div
      className={
        "fixed bottom-8 left-0 right-0 top-10 mx-auto flex h-screen flex-col items-center justify-center"
      }
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">
          Solidity Code Cooker
        </h1>
      </div>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Find related code in{" "}
        <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
          /lib/code-gen/actions.tsx
        </span>
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl px-6">
        <div className="relative flex w-full items-center">
          <Input
            ref={inputRef}
            type="text"
            name="input"
            placeholder="What would you like to cook up today?"
            value={input}
            className="h-12 rounded-lg bg-muted pl-4 pr-10"
            onChange={(e) => {
              setInput(e.target.value);
              setShowEmptyScreen(e.target.value.length === 0);
            }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
            autoComplete="off"
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            disabled={input.length === 0}
          >
            <Icons.arrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={(message: string) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? "visible" : "invisible")}
        />
      </form>
    </div>
  );
};

export default ChatPanel;
