"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast glass !bg-background-elevated !text-foreground !border-border-strong rounded-xl",
          description: "!text-foreground-muted",
          actionButton: "!bg-accent !text-accent-foreground",
          cancelButton: "!bg-white/10 !text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
