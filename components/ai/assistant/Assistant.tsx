"use client";

import { useEffect, useRef, useState } from "react";
import { Message, useAssistant } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Input } from "@/components/ui/input";

const roleToColorMap: Record<Message["role"], string> = {
  system: "red",
  user: "yellow",
  function: "blue",
  assistant: "green",
  data: "orange",
  tool: "purple", // add this line with your chosen color for 'tool'
};

type AssistantProps = {
  // for optimistic update, might not need if messages already captures. might able able to use setMessages too.
  firstMessage: string;
  threadId: string;
};
export const Assistant = ({ firstMessage, threadId }: AssistantProps) => {
  // TODO: hacky way of global state management, to be replaced with Zustand
  const isNewAsstThread = window.localStorage.getItem("is-new-asst-thread");
  const {
    status,
    messages,
    setMessages,
    input,
    setInput,
    submitMessage,
    handleInputChange,
    error,
  } = useAssistant({
    api: "/api/assistants-api",
    threadId,
  });
  console.log("messages -> ", messages);
  console.log("asst status -> ", status);

  useEffect(() => {
    if (isNewAsstThread === "true") {
      // optimistic update: add the first message to the UI before the actual message is fetched from the server such that the user sees the message immediately (better UX)
      setMessages([
        {
          id: "1",
          content: firstMessage,
          role: "user",
        },
      ]);

      // TODO: hacky way of global state management, to be replaced with Zustand
      window.localStorage.setItem("is-new-asst-thread", "false");
    }
  }, []);

  const {
    data: fetchedMessages,
    isLoading: isFetchingMessages,
    status: fetchMessagesStatus,
  } = useQuery({
    queryKey: ["asst-messages", threadId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/assistants-api/threads/${threadId}/messages`,
      );
      const asstMessages = response.data.messages;

      setMessages(asstMessages);

      if (asstMessages.length === 0) {
        setInput(firstMessage);
      }

      return asstMessages;
    },
  });

  // to programmatically call asstapi endpoint if messages is empty
  // check that input is not empty before calling
  useEffect(() => {
    if (input !== "" && messages.length === 0) {
      submitMessage();
    }
  }, [input]);

  // when status changes to accepting messages, focus the input:
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === "awaiting_message") {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {error != null && (
        <div className="relative rounded-md bg-red-500 px-6 py-4 text-white">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      {messages.map((m: Message) => {
        return (
          <div
            key={m.id}
            className="whitespace-pre-wrap"
            style={{ color: roleToColorMap[m.role] }}
          >
            <strong>{`${m.role}: `}</strong> <br />
            {m.role !== "data" && m.content}
            {m.role === "data" && (
              <>
                {(m.data as any).description}
                <br />
                <pre className={"bg-gray-200"}>
                  {JSON.stringify(m.data, null, 2)}
                </pre>
              </>
            )}
            <br />
            <br />
          </div>
        );
      })}

      {/* these two conditional render of loading animation has to be separate, otherwise there would be a time lag between the loading UI */}
      {isFetchingMessages && (
        <div className="mb-8 h-8 w-full max-w-md animate-pulse rounded-lg bg-gray-300 p-2 dark:bg-gray-600" />
      )}
      {status === "in_progress" && (
        <div className="mb-8 h-8 w-full max-w-md animate-pulse rounded-lg bg-gray-300 p-2 dark:bg-gray-600" />
      )}

      <form onSubmit={submitMessage}>
        <Input
          className="fixed bottom-20 mb-8 h-14 w-full max-w-md "
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          disabled={status !== "awaiting_message"}
        />
      </form>
    </div>
  );
};

export default Assistant;
