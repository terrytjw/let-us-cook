"use client";

import { cn } from "@/lib/utils";
import {
  Code,
  Image,
  MessageCircleMore,
  Newspaper,
  Repeat2,
  Search,
  Pickaxe,
} from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";

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
    case "Related":
      icon = <Repeat2 size={18} className="mr-2" />;
      break;
    case "Follow-up":
      icon = <Pickaxe size={18} className="mr-2" />;
      break;
    default:
      icon = <MessageCircleMore size={18} className="mr-2" />;
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
          <h2 className="mb-2 flex items-center py-2 text-lg leading-none">
            {icon}
            {title}
          </h2>
        )}
        {children}
      </section>
    </>
  );
};
