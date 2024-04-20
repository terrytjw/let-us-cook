import { useEffect } from "react";

const useAutoScroll = (elementId: string, dependencies: any[]) => {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [elementId, ...dependencies]); // include elementId in dependencies to react to changes in ID
};

export default useAutoScroll;
