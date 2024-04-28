"use client";

import * as React from "react";

export type useCopyToClipboardProps = {
  timeout?: number;
};

export const useCopyToClipboard = ({
  timeout = 2000,
}: useCopyToClipboardProps) => {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      // set timeout to reset isCopied to false after a 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
};
