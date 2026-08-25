"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LoginCard() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  return (
    <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
      <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
        Say<span className="text-accent">It</span>
      </Link>
      <p className="mt-2 text-sm text-foreground-muted">
        Sign in to save your reply history and get 5 free replies every day.
      </p>
      <Button
        className="mt-8 w-full"
        size="lg"
        onClick={() => signIn("google", { callbackUrl })}
      >
        Continue with Google
      </Button>
      <p className="mt-6 text-xs text-foreground-muted">
        By continuing, you agree to SayIt&apos;s{" "}
        <Link href="/terms" className="underline hover:text-accent">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-accent">
          Privacy Policy
        </Link>
        .
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
