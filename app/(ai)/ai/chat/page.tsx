import React from "react";
import Link from "next/link";

import BackButton from "@/components/navigation/BackButton";
import Chat from "@/components/ai/chat/Chat";

const ChatPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <h1 className="text-3xl font-bold">Chat with AI</h1>
      <section className="py-4">
        <p className="mb-4">
          Current supported providers include{" "}
          <Link
            className="underline transition-all hover:text-primary"
            href="https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic"
            target="_blank"
          >
            Anthropic
          </Link>
          ,{" "}
          <Link
            className="underline transition-all hover:text-primary"
            href="https://sdk.vercel.ai/providers/ai-sdk-providers/groq"
            target="_blank"
          >
            Groq
          </Link>{" "}
          &{" "}
          <Link
            className="underline transition-all hover:text-primary"
            href="https://sdk.vercel.ai/providers/ai-sdk-providers/openai"
            target="_blank"
          >
            OpenAI
          </Link>
          . Toggle between them in{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            /api/chat/route.ts
          </span>
        </p>
        <Chat endpoint="/api/chat" />
      </section>
      <div>
        <BackButton to="/ai" label="AI Dashboard" />
      </div>
    </main>
  );
};

export default ChatPage;
