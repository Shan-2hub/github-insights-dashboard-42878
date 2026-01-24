import React from "react";
import { cn } from "../../lib/utils";

// PUBLIC_INTERFACE
export function Card({ className, ...props }) {
  /** Surface container matching shadcn/ui Card semantics. */
  return <div className={cn("card", className)} {...props} />;
}

// PUBLIC_INTERFACE
export function CardContent({ className, ...props }) {
  /** Card inner padding wrapper. */
  return <div className={cn("card-inner", className)} {...props} />;
}
