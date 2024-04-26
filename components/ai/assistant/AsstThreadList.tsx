"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Icons } from "@/components/Icons";
import AsstThread from "@/components/ai/assistant/AsstThread";

const AsstThreadList = () => {
  const fetchThreads = async () => {
    const response = await axios.get(`/api/assistants-api/threads`);

    return response.data.threads;
  };
  const { data: threads, isLoading: isThreadsLoading } = useQuery<AsstThread[]>(
    {
      queryKey: ["asst-threads"],
      queryFn: fetchThreads,
    },
  );

  console.log("threads ->", threads);

  if (isThreadsLoading) {
    return (
      <div className="mt-4 flex items-center gap-2">
        <Icons.loading className="h-4 w-4 animate-spin" />
        Loading threads...
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="mt-4 tracking-wider text-gray-500">No threads found</div>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {threads.map((thread) => (
          <AsstThread key={thread.id} thread={thread} />
        ))}
      </div>
    </main>
  );
};

export default AsstThreadList;
