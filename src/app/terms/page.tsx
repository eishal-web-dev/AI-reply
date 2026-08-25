import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-medium">Terms of Service</h1>
        <p className="mt-4 text-sm text-foreground-muted">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground-muted">
          <p>
            This is placeholder terms-of-service text. Replace it with your
            actual terms before launch. At minimum, cover: acceptable use
            (no illegal, harassing, or abusive content generated through the
            service), the free and Pro plan limits, that AI-generated
            content may contain errors and should be reviewed before
            sending, account termination conditions, and limitation of
            liability.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
