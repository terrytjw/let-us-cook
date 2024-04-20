import React from "react";

import Chat from "@/components/ai/Chat";

const ChatPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <h1 className="text-3xl font-bold">Chat with AI</h1>
      <section className="py-4">
        <Chat />
      </section>
    </main>
  );
};

export default ChatPage;
