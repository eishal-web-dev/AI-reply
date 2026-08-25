import { ClipboardPaste, SlidersHorizontal, Send } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste or upload",
    description:
      "Drop in the message you received, or upload a screenshot — SayIt reads it either way.",
  },
  {
    icon: SlidersHorizontal,
    title: "Pick your tone",
    description:
      "Choose the tone, language, and context so the reply sounds like you, not a robot.",
  },
  {
    icon: Send,
    title: "Copy and send",
    description:
      "Get a ready-to-send reply in seconds. Tweak it, copy it, done.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          How it works
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          Three steps to your reply
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs text-foreground-muted">
                0{i + 1}
              </span>
            </div>
            <h3 className="font-display mt-4 text-lg font-medium">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
