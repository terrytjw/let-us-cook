"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AIMessagesLeft = () => {
  const fetchMessagesLeft = async () => {
    const response = await axios.get(`/api/ai/credits`);

    console.log("response -> ", response);

    return response.data.credits;
  };
  const { data: aiMessagesLeft, isLoading: isAiMessagesLeftLoading } =
    useQuery<number>({
      queryKey: ["ai-credits"],
      queryFn: fetchMessagesLeft,
    });

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed right-5 top-[6.5rem] cursor-default rounded border border-primary bg-primary/10 p-2 text-primary">
            {isAiMessagesLeftLoading ? "..." : aiMessagesLeft}{" "}
            <span className="text-sm text-primary/80">Messages Left</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="w-60 border border-primary p-4 font-medium"
          side="top"
        >
          <h3>{aiMessagesLeft} Messages Left</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIMessagesLeft;
