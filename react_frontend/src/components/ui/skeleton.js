import React from "react";
import { cn } from "../../lib/utils";

// PUBLIC_INTERFACE
export function Skeleton({ className, ...props }) {
  /** Skeleton shimmer block for loading states. */
  return <div className={cn("skeleton", className)} {...props} />;
}
