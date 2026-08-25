import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border-subtle bg-white/[0.03] px-4 py-2 text-sm text-foreground placeholder:text-foreground-muted/70 outline-none transition-colors focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
