import { useEffect, useState, useRef } from "react";
import type { AI } from "@/lib/code-gen/actions";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { cn } from "@/lib/utils";
import { UserMessage } from "@/components/ai/code-gen/UserMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Square } from "lucide-react";
import { EmptyScreen } from "@/components/ai/code-gen/EmptyScreen";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiMessages, setAiMessages] = useAIState<typeof AI>();
  const { submitUserInput } = useActions<typeof AI>();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);

  // Focus on input when button is pressed
  useEffect(() => {
    if (isButtonPressed) {
      inputRef.current?.focus();
      setIsButtonPressed(false);
    }
  }, [isButtonPressed]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear messages if button is pressed
    if (isButtonPressed) {
      handleClear();
      setIsButtonPressed(false);
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
    setMessages((currentMessages) => [
      ...currentMessages,
      responseMessage as any,
    ]);

    setInput("");
  };

  // Clear messages
  const handleClear = () => {
    setIsButtonPressed(true);
    setMessages([]);
    setAiMessages([]);
  };

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

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0 && !isButtonPressed) {
    return (
      <div className="pointer-events-none fixed bottom-2 left-0 right-0 mx-auto flex items-center justify-center md:bottom-8">
        <Button
          type="button"
          variant={"secondary"}
          className="group pointer-events-auto rounded-full bg-secondary/80 transition-all hover:scale-105"
          onClick={() => handleClear()}
        >
          <span className="mr-2 hidden text-sm duration-300 animate-in fade-in group-hover:block">
            New
          </span>
          <Plus size={18} className="transition-all group-hover:rotate-90" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={
        "fixed bottom-8 left-0 right-0 top-10 mx-auto flex h-screen flex-col items-center justify-center"
      }
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Solidity Code Generator</h1>
      </div>
      <p className="mb-4 mt-2">
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
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={(message) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? "visible" : "invisible")}
        />
      </form>
    </div>
  );
}
