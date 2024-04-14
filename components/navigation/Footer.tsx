import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import ThemeModeToggle from "./ThemeModeToggle";
import { Icons } from "../Icons";

type FooterProps = React.HTMLAttributes<HTMLDivElement>;
const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Icons.chevronsDown />
          </Link>
          <p className="pr-2 text-gray-500"> | </p>
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            Built with ❤️ by{" "}
            <Link
              href="https://github.com/terrytjw"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 transition-all duration-700 hover:text-primary"
            >
              Terry Tan
            </Link>
            . Get the source code on{" "}
            <Link
              href="https://github.com/terrytjw/next-gen-template"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 transition-all duration-700 hover:text-orange-500"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <ThemeModeToggle />
      </div>
    </footer>
  );
};

export default Footer;
