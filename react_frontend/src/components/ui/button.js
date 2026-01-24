import React from "react";
import { cn } from "../../lib/utils";

const VARIANT = {
  default: "btn",
  primary: "btn btn-primary",
};

// PUBLIC_INTERFACE
export function Button({ className, variant = "default", asChild = false, ...props }) {
  /** Button primitive (supports `asChild` to render links with button styles). */
  const Comp = asChild ? "a" : "button";
  return <Comp className={cn(VARIANT[variant] ?? VARIANT.default, className)} {...props} />;
}
