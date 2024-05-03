import React from "react";

import BackButton from "@/components/navigation/BackButton";
import Chat from "@/components/ai/chat/Chat";

const ChatPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <h1 className="text-3xl font-bold">Chat with AI (Legacy)</h1>
      <section className="py-4">
        <p>
          Current supported providers include Anthropic, Groq, Ollama & OpenAI.
          Toggle between them in{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            /api/chat/route.ts
          </span>
        </p>
        <p className="mb-4 mt-3">
          Note that the Legacy Chat page does not work if{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            ai
          </span>{" "}
          is on a version after{" "}
          <span className="rounded border border-primary p-1 font-mono text-primary">
            3.0.18
          </span>
          . letuscook.io is currently using{" "}
          <span className="rounded border border-primary p-1 font-mono text-primary">
            3.1.1
          </span>
        </p>
        <Chat endpoint="/api/chat-legacy" />
      </section>
      <div>
        <BackButton to="/ai" label="AI Dashboard" />
      </div>
    </main>
  );
};

export default ChatPage;
