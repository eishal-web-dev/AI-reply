"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const freeFeatures = [
  "5 replies per day",
  "All basic tones",
  "English, Urdu, and Roman Urdu",
  "Text input",
];

const proFeatures = [
  "Unlimited replies",
  "Screenshot understanding",
  "Every language and tone",
  "Reply history",
  "Priority generation",
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Pricing
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          Start free. Upgrade when you need to.
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border-subtle p-8">
          <h3 className="font-display text-xl font-medium">Free</h3>
          <p className="mt-1 text-sm text-foreground-muted">
            For everyday replies
          </p>
          <p className="font-display mt-6 text-4xl font-medium">$0</p>
          <ul className="mt-6 space-y-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" /> {f}
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="mt-8 w-full"
            onClick={() => signIn("google")}
          >
            Get started free
          </Button>
        </div>

        <div className="glass relative rounded-3xl p-8">
          <Badge className="absolute right-8 top-8">Coming soon</Badge>
          <h3 className="font-display text-xl font-medium">Pro</h3>
          <p className="mt-1 text-sm text-foreground-muted">
            For power users and businesses
          </p>
          <p className="font-display mt-6 text-4xl font-medium">
            $3.99
            <span className="text-base font-normal text-foreground-muted">
              {" "}
              / month
            </span>
          </p>
          <p className="text-xs text-foreground-muted">or PKR 499/month</p>
          <ul className="mt-6 space-y-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" /> {f}
              </li>
            ))}
          </ul>
          <Button disabled className="mt-8 w-full">
            Notify me at launch
          </Button>
        </div>
      </div>
    </section>
  );
}
