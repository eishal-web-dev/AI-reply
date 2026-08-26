"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function AshesCallbackInner() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Signing you into SayIt…");

  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      setMessage("The Ashes sign-in link is missing or expired.");
      return;
    }

    (async () => {
      const result = await signIn("ashes", {
        code,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setMessage("Could not sign in with Ashes. Please try again.");
        return;
      }

      window.location.assign(result.url || "/dashboard");
    })();
  }, [params]);

  return <p className="mt-4 text-sm text-foreground-muted">{message}</p>;
}

export default function AshesCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
        <div className="font-display text-2xl font-semibold tracking-tight">
          Say<span className="text-accent">It</span>
        </div>
        <Suspense fallback={<p className="mt-4 text-sm text-foreground-muted">Signing you into SayIt…</p>}>
          <AshesCallbackInner />
        </Suspense>
      </div>
    </main>
  );
}
