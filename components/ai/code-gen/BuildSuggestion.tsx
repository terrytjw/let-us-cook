"use client";

import React from "react";
import { useActions, useStreamableValue, useUIState } from "ai/rsc";
import { AI } from "@/lib/code-gen/actions";
import { PartialSuggestions } from "@/validations/code-gen/suggestions";

import UserMessage from "@/components/ai/code-gen/UserMessage";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/Icons";

type BuildSuggestionProps = {
  aiSuggestions: PartialSuggestions;
};
const BuildSuggestion = ({ aiSuggestions }: BuildSuggestionProps) => {
  const { submitUserInput } = useActions<typeof AI>();
  const [, setMessages] = useUIState<typeof AI>();
  const [data, error, pending] =
    useStreamableValue<PartialSuggestions>(aiSuggestions);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    // // Get the submitter of the form
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLInputElement;
    let query = "";
    if (submitter) {
      formData.append(submitter.name, submitter.value);
      query = submitter.value;
    }

    const userMessage = {
      id: Date.now(),
      component: <UserMessage message={query} isFirstMessage={false} />,
    };

    const responseMessage = await submitUserInput(formData);
    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      responseMessage,
    ]);
  };

  if (pending && !data) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-44" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      {data?.items
        ?.filter((item) => item?.label !== "")
        .map((item, index) => (
          <TooltipProvider delayDuration={150} key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex gap-x-2 whitespace-normal text-left font-semibold transition-all hover:border-primary hover:bg-primary/0 hover:text-primary"
                  variant="outline"
                  type="submit"
                  name={"related_query"}
                  value={item?.prompt}
                >
                  {item?.label}
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="w-60 border border-primary p-4 font-medium"
                side="bottom"
              >
                {item?.prompt}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
    </form>
  );
};

export default BuildSuggestion;
