import * as React from "react";

/**
 * Custom React hook that determines if the user has scrolled to the bottom of the page.
 *
 * @param {number} offset - A value in pixels that defines how far from the actual bottom of the page to trigger. Defaults to 0.
 * @returns {boolean} - Returns true if the scroll position is at the bottom minus the offset, otherwise returns false.
 */
export const useAtBottom = (offset = 0) => {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - offset,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return isAtBottom;
};
