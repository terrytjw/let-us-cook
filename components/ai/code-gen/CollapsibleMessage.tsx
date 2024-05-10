import React, { useEffect, useState } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/Icons";

type CollapsibleMessageProps = {
  message: {
    id: number;
    isCollapsed?: StreamableValue<boolean>;
    component: React.ReactNode;
  };
  isLastMessage?: boolean;
};
const CollapsibleMessage = ({
  message,
  isLastMessage = false,
}: CollapsibleMessageProps) => {
  const [data] = useStreamableValue(message.isCollapsed);
  const isCollapsed = data ?? false;
  const [open, setOpen] = useState(isLastMessage);

  useEffect(() => {
    setOpen(isLastMessage);
  }, [isCollapsed, isLastMessage]);

  // if not collapsed, return the component
  if (!isCollapsed) {
    return message.component;
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <CollapsibleTrigger asChild>
        <div
          className={cn(
            "flex w-full justify-end",
            !isCollapsed ? "hidden" : "",
          )}
        >
          <Button
            variant="ghost"
            size={"icon"}
            className={cn("-mt-3 rounded-full")}
          >
            <Icons.chevronDown
              className={cn(
                open ? "rotate-180" : "rotate-0",
                "h-4 w-4 transition-all",
              )}
            />
            <span className="sr-only">collapse</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>{message.component}</CollapsibleContent>
      {!open && <Separator className="my-2 bg-muted" />}
    </Collapsible>
  );
};

export default CollapsibleMessage;
