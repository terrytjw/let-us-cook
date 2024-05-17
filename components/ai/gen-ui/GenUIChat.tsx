"use client";

import React, { useEffect, useState } from "react";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { useEnterSubmit } from "@/hooks/useEnterSubmit";
import type { AI } from "@/lib/gen-ui/actions";
import { useQueryClient } from "@tanstack/react-query";
import { nanoid } from "@/lib/utils";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SpinnerMessage,
  UserMessage,
} from "@/components/ai/gen-ui/GenUIMessage";
import Textarea from "react-textarea-autosize";

const GenUIChat = () => {
  const queryClient = useQueryClient();

  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const [inputValue, setInputValue] = useState("");
  const [lastAsstMessageId, setLastAsstMessageId] = useState("");
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  const { formRef, onKeyDown } = useEnterSubmit();

  // aiState only changes after a stream is completed
  // so we can use it to determine when the assistant is done thinking
  // useful for disabling the submit button
  useEffect(() => {
    if (aiState[aiState.length - 1]?.id !== lastAsstMessageId) {
      setIsAssistantThinking(false);
    }
  }, [aiState]);

  console.log("aiState -> ", aiState);

  return (
    <main className="rounded-lg border border-secondary p-4">
      {messages.length === 0 && (
        <p className="text-center tracking-wider text-gray-500">
          Ask about your flight info...
        </p>
      )}

      <div className="py-4">
        {messages.map((message, index) => (
          <div key={message.id}>
            {message.display}
            {index < messages.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>

      <form
        className="mt-8"
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();

          // // submit is disabled if input is empty or only whitespace or if content is still streaming
          if (!inputValue.trim() || isAssistantThinking) return;

          setLastAsstMessageId(aiState[aiState.length - 1]?.id);
          setIsAssistantThinking(true);

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: nanoid(),
              role: "user",
              display: <UserMessage>{inputValue}</UserMessage>,
            },
            {
              id: nanoid(),
              role: "assistant",
              display: <SpinnerMessage message="" />, // add SpinnerMessage
            },
          ]);

          // clear input before the assistant responds as the assistant's response is not immediate - we don't want a UI delay
          setInputValue("");

          const responseMessage = await submitUserMessage(inputValue);

          setMessages((currentConversation) => {
            // remove the SpinnerMessage and add the actual response
            const updatedMessages = currentConversation.filter(
              (msg) =>
                React.isValidElement(msg.display) &&
                msg.display.type !== SpinnerMessage,
            );
            return [...updatedMessages, responseMessage];
          });

          setIsAssistantThinking(false);
          queryClient.invalidateQueries({ queryKey: ["ai-credits"] });
        }}
      >
        <div className="relative">
          <Textarea
            className="w-full resize-none rounded-md p-6 focus-within:outline-primary sm:text-sm"
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Send a message."
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            className="absolute bottom-6 right-5"
            size="sm"
            disabled={!inputValue.trim()}
          >
            <div className="flex items-center gap-2">
              {isAssistantThinking ? (
                <Icons.loading className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.send className="h-4 w-4" />
              )}
            </div>
          </Button>
        </div>
      </form>
    </main>
  );
};

export default GenUIChat;
