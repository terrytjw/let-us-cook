import React from "react";
import { cn } from "@/lib/utils";

type UserMessageProps = {
  message: string;
  isFirstMessage?: boolean;
};
export const UserMessage = ({ message, isFirstMessage }: UserMessageProps) => {
  return (
    <div className={cn({ "mt-4": !isFirstMessage })}>
      <div className="text-xl">{message}</div>
    </div>
  );
};
