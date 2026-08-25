import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Say<span className="text-accent">It</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-foreground-muted">
              The AI reply generator for WhatsApp, email, customer support,
              and everyday conversations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Product
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="#how-it-works" className="hover:text-accent">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-accent">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-accent">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-accent">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-accent">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 text-xs text-foreground-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SayIt. All rights reserved.</p>
          <p className="typing-mark" aria-hidden>
            <span />
            <span />
            <span />
          </p>
        </div>
      </div>
    </footer>
  );
}
