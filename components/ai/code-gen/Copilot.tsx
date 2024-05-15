"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActions, useStreamableValue, useUIState } from "ai/rsc";
import { AI } from "@/lib/code-gen/actions";
import { PartialInquiry } from "@/validations/code-gen/inquire";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/Icons";

type CopilotProps = {
  inquiry?: PartialInquiry;
};
const Copilot = ({ inquiry }: CopilotProps) => {
  const queryClient = useQueryClient();

  const [completed, setCompleted] = useState(false);
  const [query, setQuery] = useState("");
  const [skipped, setSkipped] = useState(false);
  const [data, error, pending] = useStreamableValue<PartialInquiry>(inquiry);
  const [checkedOptions, setCheckedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserInput } = useActions<typeof AI>();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    checkIfButtonShouldBeEnabled();
  };

  const handleOptionChange = (selectedOption: string) => {
    const updatedCheckedOptions = {
      ...checkedOptions,
      [selectedOption]: !checkedOptions[selectedOption],
    };
    setCheckedOptions(updatedCheckedOptions);
    checkIfButtonShouldBeEnabled(updatedCheckedOptions);
  };

  const checkIfButtonShouldBeEnabled = (currentOptions = checkedOptions) => {
    const anyCheckboxChecked = Object.values(currentOptions).some(
      (checked) => checked,
    );
    setIsButtonDisabled(!(anyCheckboxChecked || query));
  };

  const updatedQuery = () => {
    const selectedOptions = Object.entries(checkedOptions)
      .filter(([, checked]) => checked)
      .map(([option]) => option);
    return [...selectedOptions, query].filter(Boolean).join(", ");
  };

  useEffect(() => {
    checkIfButtonShouldBeEnabled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    skip?: boolean,
  ) => {
    e.preventDefault();
    setCompleted(true);
    setSkipped(skip || false);

    const formData = skip
      ? undefined
      : new FormData(e.target as HTMLFormElement);

    const responseMessage = await submitUserInput(formData, skip);

    if (responseMessage.errorOccurred) {
      console.error("Error occurred during GenUI process.");
    }

    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    queryClient.invalidateQueries({ queryKey: ["ai-credits"] });
  };

  const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
    onFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true);
  };

  if (error) {
    return (
      <Card className="flex w-full items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Icons.sparkles className="h-4 w-4" />
          <h5 className="truncate text-xs text-muted-foreground">
            {`error: ${error}`}
          </h5>
        </div>
      </Card>
    );
  }

  if (skipped) {
    return null;
  }

  if (completed) {
    return (
      <Card className="flex w-full items-center justify-between p-3 md:p-4">
        <div className="flex min-w-0 flex-1 items-center space-x-2">
          <Icons.cook className="h-4 w-4 flex-shrink-0" />
          <h5 className="truncate text-xs text-muted-foreground">
            {updatedQuery()}
          </h5>
        </div>
        <Icons.check size={16} className="h-4 w-4 text-green-500" />
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full rounded-lg p-4">
      <div className="mb-4 flex items-center">
        <Icons.cook
          className={cn("h-4 w-4 flex-shrink-0", { "animate-spin": pending })}
        />
        <p className="ml-2 text-base font-semibold text-foreground">
          {data?.question}
        </p>
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="mb-4 flex flex-wrap justify-start gap-x-6 gap-y-2">
          {data?.options?.map((option, index) => (
            <div
              key={`option-${index}`}
              className={cn(
                "mb-2 flex items-center justify-center space-x-1.5",
              )}
            >
              <Checkbox
                id={option?.value}
                name={option?.value}
                onCheckedChange={() =>
                  handleOptionChange(option?.label as string)
                }
              />
              <label
                className="cursor-pointer select-none whitespace-nowrap text-sm"
                htmlFor={option?.value}
              >
                {option?.label}
              </label>
            </div>
          ))}
        </div>
        {data?.allowsInput && (
          <div className="mb-6 flex flex-col space-y-2 text-sm">
            <label className="text-muted-foreground" htmlFor="query">
              {data?.inputLabel}
            </label>
            <Input
              autoComplete="off"
              type="text"
              name="additional_query"
              className="w-full"
              id="query"
              placeholder={data?.inputPlaceholder}
              value={query}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="flex">
          <p className="mr-auto h-fit rounded border border-green-500 bg-green-500/10 px-2 py-1 text-xs text-green-500">
            Powered by GPT-4o
          </p>
          <div className="flex gap-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={pending}
            >
              <Icons.fastForward size={16} className="mr-1" />
              Skip
            </Button>
            <Button type="submit" disabled={isButtonDisabled || pending}>
              <Icons.arrowRight size={16} className="mr-1" />
              Proceed
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Copilot;
