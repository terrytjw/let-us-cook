"use client";

import { cn } from "@/lib/utils";
import {
  Code,
  Image,
  MessageCircleMore,
  Newspaper,
  Lightbulb,
} from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  title?: string;
  separator?: boolean;
};
export const Section = ({
  children,
  className,
  size = "md",
  title,
  separator = false,
}: SectionProps) => {
  let icon: React.ReactNode;
  switch (title) {
    case "Images":
      // eslint-disable-next-line jsx-a11y/alt-text
      icon = <Image size={18} className="mr-2" />;
      break;
    case "Sources":
      icon = <Newspaper size={18} className="mr-2" />;
      break;
    case "Code":
      icon = <Code size={18} className="mr-2" />;
      break;
    case "AI Suggestions":
      icon = <MessageCircleMore size={18} className="mr-2" />;
      break;
    case "Custom prompt":
      icon = <Lightbulb size={18} className="mr-2" />;
      break;
    default:
      icon = null;
  }

  return (
    <>
      {separator && <Separator className="my-2" />}
      <section
        className={cn(
          ` ${size === "sm" ? "py-1" : size === "lg" ? "py-4" : "py-2"}`,
          className,
        )}
      >
        {title && (
          <div className="mb-2 flex items-center py-2 text-lg leading-none">
            {icon}
            {title}
            <div className="ml-auto">
              {title === "AI Suggestions" && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.info
                        size={18}
                        className="ml-1 transition-all hover:text-primary"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      className="w-60 border border-primary p-4 font-medium"
                      side="top"
                    >
                      <p>
                        AI recommended suggestions to help you improve contract
                        security and features.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
        {children}
      </section>
    </>
  );
};
