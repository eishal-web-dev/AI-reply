"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ASHES_SSO =
  "https://www.ashesstack.cloud/api/account-google?sso=issue&return=" +
  encodeURIComponent("https://aireply-dusky.vercel.app/auth/ashes/callback");

function LoginCard() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  function continueWithAshes() {
    const url = new URL(ASHES_SSO);
    url.searchParams.set("sayitNext", callbackUrl);
    window.location.assign(url.toString());
  }

  return (
    <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
      <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
        Say<span className="text-accent">It</span>
      </Link>
      <p className="mt-2 text-sm text-foreground-muted">
        Use your Ashes account to save reply history and get 3 free replies every day.
      </p>
      <Button className="mt-8 w-full" size="lg" onClick={continueWithAshes}>
        Continue with Ashes
      </Button>
      <p className="mt-3 text-xs text-foreground-muted">
        Already signed into Ashes? You&apos;ll come straight back to SayIt.
      </p>
      <p className="mt-6 text-xs text-foreground-muted">
        By continuing, you agree to SayIt&apos;s{" "}
        <Link href="/terms" className="underline hover:text-accent">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-accent">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </main>
  );
}
