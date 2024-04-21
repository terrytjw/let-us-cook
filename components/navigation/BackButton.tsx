import React from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

type BackButtonProps = {
  to: string;
  label: string;
};
const BackButton = ({ to, label }: BackButtonProps) => {
  return (
    <Link
      href={to}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        // "absolute left-10 top-4 md:left-8 md:top-8",
      )}
    >
      <div className="flex items-center">
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Back to {label}
      </div>
    </Link>
  );
};

export default BackButton;
