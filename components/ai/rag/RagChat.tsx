"use client";

import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

// import { ChatMessageBubble } from "@/components/ChatMessageBubble";
// import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
// import { IntermediateStep } from "./IntermediateStep";

type RagChatProps = {
  endpoint: string;
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
};
const RagChat = ({
  endpoint,
  emptyStateComponent,
  placeholder,
  titleText,
  emoji,
  showIngestForm,
  showIntermediateStepsToggle,
}: RagChatProps) => {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>
          Say something...
          <input
            className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
            value={input}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default RagChat;
