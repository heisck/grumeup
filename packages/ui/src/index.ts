import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes.
 * Combines clsx for conditional classes with tailwind-merge
 * to resolve conflicting utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Re-export shadcn/ui components as they are added
// Example: export { Button } from "./components/button";
