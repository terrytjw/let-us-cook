"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/Icons";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  title?: string;
  separator?: boolean;
};
const Section = ({
  children,
  className,
  size = "md",
  title,
  separator = false,
}: SectionProps) => {
  let icon: React.ReactNode;
  let poweredBy = "";

  switch (title) {
    case "Images":
      // eslint-disable-next-line jsx-a11y/alt-text
      icon = <Icons.media size={18} className="mr-2" />;
      break;

    case "Sources":
      icon = <Icons.newspaper size={18} className="mr-2" />;
      break;

    case "Code":
      icon = <Icons.code size={18} className="mr-2" />;
      // poweredBy = "GPT-4 Omni";
      break;

    case "Explanation":
      icon = <Icons.bookOpen size={18} className="mr-2" />;
      // poweredBy = "Llama-3-70b (Groq)";
      break;

    case "AI Suggestions":
      icon = <Icons.messageCircleMore size={18} className="mr-2" />;
      // poweredBy = "GPT-4 Omni";
      break;

    case "Custom prompt":
      icon = <Icons.idea size={18} className="mr-2" />;
      break;

    default:
      icon = null;
  }

  const poweredByTag = (
    <p
      className={cn("ml-2 rounded border px-2 py-1 text-xs", {
        "border-orange-500 bg-orange-500/10 text-orange-500":
          poweredBy === "Llama-3-70b (Groq)",
        "border-yellow-600 bg-yellow-600/10 text-yellow-600":
          poweredBy === "Claude Haiku",
        "border-green-500 bg-green-500/10 text-green-500":
          poweredBy === "GPT-4 Omni",
      })}
    >
      Powered by {poweredBy}
    </p>
  );

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
            {poweredBy && poweredByTag}

            {title === "AI Suggestions" && (
              <div className="ml-auto">
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
                        security and features. Hover over each option to see
                        more.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
        {children}
      </section>
    </>
  );
};

export default Section;
