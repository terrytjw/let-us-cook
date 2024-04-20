import React from "react";

import Chat from "@/components/ai/Chat";

const ChatPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <h1 className="text-3xl font-bold">Chat with AI</h1>
      <section className="py-4">
        <p>
          Current supported providers include Anthropic, Groq, Ollama & OpenAI.
          Toggle between them in{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            /api/chat/route.ts
          </span>
        </p>
        <Chat />
      </section>
    </main>
  );
};

export default ChatPage;
