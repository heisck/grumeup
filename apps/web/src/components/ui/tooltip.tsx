"use client";

import { useState } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ content, children, position = "top", delay = 150 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  return (
    <button
      type="button"
      className="relative inline-flex outline-none bg-transparent border-0 p-0 text-left cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <span
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap px-2.5 py-1.5 text-xs font-sans font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg shadow-md border border-zinc-700 dark:border-zinc-300 pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${getPositionClasses(
            position
          )}`}
        >
          {content}
        </span>
      )}
    </button>
  );
}

function getPositionClasses(position: "top" | "bottom" | "left" | "right"): string {
  if (position === "bottom") {
    return "top-full mt-2 left-1/2 -translate-x-1/2";
  }
  if (position === "left") {
    return "right-full mr-2 top-1/2 -translate-y-1/2";
  }
  if (position === "right") {
    return "left-full ml-2 top-1/2 -translate-y-1/2";
  }

  // default top
  return "bottom-full mb-2 left-1/2 -translate-x-1/2";
}
