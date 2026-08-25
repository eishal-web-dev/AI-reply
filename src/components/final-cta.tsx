"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="ember-glow relative overflow-hidden rounded-3xl border border-border-subtle p-10 text-center sm:p-16">
        <h2 className="font-display relative text-3xl font-medium sm:text-4xl">
          Never wonder what to say again.
        </h2>
        <p className="relative mt-3 text-foreground-muted">
          Your first reply is free — no signup required.
        </p>
        <Button
          size="lg"
          className="relative mt-8"
          onClick={() => signIn("google")}
        >
          Try SayIt free
        </Button>
      </div>
    </section>
  );
}
