import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../../lib/utils";

const TabsCtx = createContext(null);

// PUBLIC_INTERFACE
export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  /** Tabs container; controlled or uncontrolled. */
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;

  const api = useMemo(
    () => ({
      value: current,
      setValue: (v) => {
        onValueChange?.(v);
        if (value == null) setInternal(v);
      },
    }),
    [current, onValueChange, value]
  );

  return (
    <TabsCtx.Provider value={api}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

// PUBLIC_INTERFACE
export function TabsList({ className, ...props }) {
  /** Row of tab triggers. */
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white/5 p-1",
        className
      )}
      {...props}
    />
  );
}

// PUBLIC_INTERFACE
export function TabsTrigger({ value, className, children, ...props }) {
  /** A tab button. */
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-semibold transition duration-200",
        active
          ? "bg-gradient-to-b from-[rgba(30,58,138,0.65)] to-[rgba(30,58,138,0.25)] border border-[rgba(245,158,11,0.35)]"
          : "bg-white/0 border border-transparent text-white/70 hover:bg-white/5 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function TabsContent({ value, className, children, ...props }) {
  /** Tab panel content. */
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("TabsContent must be used within <Tabs>");
  if (ctx.value !== value) return null;

  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}
