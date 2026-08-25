"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const examples = [
  {
    label: "Freelance client",
    before: "client ko bolna hai payment send krde kam complete hogya",
    after:
      "Hi, the requested work has now been completed. Please send the remaining payment at your earliest convenience. Thank you!",
  },
  {
    label: "Customer support",
    before: "my order still hasnt come and its been 2 weeks im annoyed",
    after:
      "I'm sorry for the delay — two weeks is longer than it should take. Let me look into your order right away and get this resolved for you today.",
  },
  {
    label: "WhatsApp",
    before: "bhai kal available ho? milna hai thora kaam hai",
    after:
      "Hey! Yes, I'm free tomorrow — what time works for you? Happy to meet up and go through it.",
  },
];

export function BeforeAfter() {
  const [active, setActive] = useState(0);
  const example = examples[active];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          See it in action
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          From rough to ready
        </h2>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.label}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === i
                ? "border-accent bg-accent/15 text-accent"
                : "border-border-subtle text-foreground-muted hover:border-border-strong"
            )}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            Before
          </p>
          <p className="mt-3 text-foreground-muted">{example.before}</p>
        </div>

        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
          <ArrowRight className="h-4 w-4" />
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            After · SayIt
          </p>
          <p className="font-display mt-3 leading-relaxed">{example.after}</p>
        </div>
      </div>
    </section>
  );
}
