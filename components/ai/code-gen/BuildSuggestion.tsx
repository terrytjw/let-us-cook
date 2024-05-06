"use client";

import React from "react";
import { useActions, useStreamableValue, useUIState } from "ai/rsc";
import { AI } from "@/lib/code-gen/actions";
import { PartialSuggestions } from "@/validations/code-gen/suggestions";

import { ArrowRight } from "lucide-react";
import { UserMessage } from "@/components/ai/code-gen/UserMessage";
import { Button } from "@/components/ui/button";

export interface BuildSuggestionProps {
  aiSuggestions: PartialSuggestions;
}

export const BuildSuggestion: React.FC<BuildSuggestionProps> = ({
  aiSuggestions,
}) => {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-x-2">
      {data?.items
        ?.filter((item) => item?.label !== "")
        .map((item, index) => (
          <Button
            className="flex gap-x-2 whitespace-normal text-left font-semibold transition-all hover:border-primary hover:bg-primary/0 hover:text-primary"
            variant="outline"
            type="submit"
            name={"related_query"}
            value={item?.prompt}
            key={index}
          >
            {item?.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ))}
    </form>
  );
};

export default BuildSuggestion;
