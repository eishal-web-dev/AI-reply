"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PayPage() {
  const { data: session, status } = useSession();
  const [method, setMethod] = useState("raast");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (status === "loading") {
    return <main className="flex min-h-screen items-center justify-center">Loading…</main>;
  }

  if (status !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl">Sign in to upgrade</h1>
          <p className="mt-2 text-sm text-foreground-muted">Your SayIt Pro access is attached to your Ashes account.</p>
          <Button className="mt-6 w-full" onClick={() => window.location.assign("/login?callbackUrl=%2Fpay")}>Continue with Ashes</Button>
        </div>
      </main>
    );
  }

  async function submitPayment() {
    if (!reference.trim()) {
      toast.error("Enter your transaction/reference ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/billing/local-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, reference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit payment.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit payment.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="glass w-full max-w-lg rounded-3xl p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Ashes Pay</p>
          <h1 className="font-display mt-3 text-3xl">Payment submitted</h1>
          <p className="mt-3 text-sm text-foreground-muted">We received your transaction reference. Your SayIt Pro access will activate after payment verification.</p>
          <Button className="mt-6" onClick={() => window.location.assign("/dashboard")}>Back to SayIt</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-foreground-muted hover:text-foreground">← Back to SayIt</Link>
      <div className="glass mt-8 rounded-3xl p-7 sm:p-9">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Ashes Pay</p>
        <h1 className="font-display mt-3 text-3xl font-medium">Upgrade to SayIt Pro</h1>
        <p className="mt-2 text-foreground-muted">PKR 499 for 30 days of unlimited replies.</p>

        <div className="mt-7 rounded-2xl border border-border-subtle p-5">
          <p className="text-sm font-medium">Pay to Ashes Stack</p>
          <p className="mt-2 text-sm text-foreground-muted">Use Raast, bank transfer, Easypaisa or JazzCash. Your payment destination will be shown here once the local receiving account is configured.</p>
          <p className="mt-3 text-xs text-foreground-muted">For now, if you already received payment instructions from Ashes, complete the transfer and submit the transaction/reference ID below.</p>
        </div>

        <div className="mt-6">
          <Label>Payment method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="raast">Raast / Bank transfer</SelectItem>
              <SelectItem value="easypaisa">Easypaisa</SelectItem>
              <SelectItem value="jazzcash">JazzCash</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5">
          <Label htmlFor="reference">Transaction / reference ID</Label>
          <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. RFT123456789" className="mt-2" />
        </div>

        <div className="mt-5 rounded-2xl border border-border-subtle p-4 text-sm text-foreground-muted">
          Account: {session?.user?.email}
        </div>

        <Button className="mt-6 w-full" size="lg" onClick={submitPayment} disabled={loading}>
          {loading ? "Submitting…" : "I have paid — submit for verification"}
        </Button>
      </div>
    </main>
  );
}
