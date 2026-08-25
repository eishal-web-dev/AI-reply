import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-xl border border-border-subtle bg-white/[0.03] px-4 py-3 text-base text-foreground placeholder:text-foreground-muted/70 outline-none transition-colors focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
