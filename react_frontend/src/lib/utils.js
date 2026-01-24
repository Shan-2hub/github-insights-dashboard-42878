import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// PUBLIC_INTERFACE
export function cn(...inputs) {
  /** Merge Tailwind classes with conditional class names (shadcn/ui pattern). */
  return twMerge(clsx(inputs));
}
