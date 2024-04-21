"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import { useAtBottom } from "@/hooks/useAtBottom";

type ChatScrollAnchorProps = {
  trackVisibility?: boolean;
};
/**
 * A React component that ensures the chat remains scrolled to the bottom unless the user has scrolled up.
 * This component uses an intersection observer to check if the bottom of the chat is in view.
 *
 * @param {ChatScrollAnchorProps} props - The properties passed to the component.
 * @param {boolean} props.trackVisibility - If true, the component will track the visibility of the chat's bottom.
 * @returns {JSX.Element} - A React element with a ref attached that acts as the scroll anchor.
 */
export const ChatScrollAnchor = ({
  trackVisibility,
}: ChatScrollAnchorProps) => {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -150px 0px",
  });

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
};
