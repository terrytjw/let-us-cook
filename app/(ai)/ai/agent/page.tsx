import React from "react";

import BackButton from "@/components/navigation/BackButton";
import AssistantAction from "@/components/ai/assistant/AssistantAction";
import AsstThreadList from "@/components/ai/assistant/AsstThreadList";

const AgentPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">OpenAI Assistants API</h1>
        <AssistantAction />
      </div>
      <section className="py-4">
        <p>
          Find related code in{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            /api/assistants-api/...
          </span>
        </p>
        <AsstThreadList />
      </section>
      <div>
        <BackButton to="/ai" label="AI Dashboard" />
      </div>
    </main>
  );
};

export default AgentPage;
