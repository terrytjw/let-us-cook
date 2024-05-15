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

const AICredits = () => {
  const fetchMessagesLeft = async () => {
    const response = await axios.get(`/api/credits`);

    return response.data.credits;
  };
  const { data: aiCredits, isLoading: isAiCreditsLoading } = useQuery<number>({
    queryKey: ["ai-credits"],
    queryFn: fetchMessagesLeft,
  });

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-default rounded border border-primary bg-primary/10 px-2 py-1 text-primary">
            {isAiCreditsLoading ? "..." : aiCredits}{" "}
            <span className="text-sm text-primary/80">Messages Left</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 border border-primary p-4 font-medium">
          <p>
            Each user is only entitled to 30 messages per month. If you need
            more, please contact us.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AICredits;
