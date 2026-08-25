import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-medium">Privacy Policy</h1>
        <p className="mt-4 text-sm text-foreground-muted">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground-muted">
          <p>
            This is placeholder privacy policy text. Replace it with your
            actual policy before launch. At minimum, cover: what data SayIt
            collects (account info, usage counts, and — for signed-in users —
            reply history you choose to save), how screenshots are processed
            (used only to generate a reply and never stored), how long data
            is retained, third-party processors (Anthropic for AI
            generation, Google for authentication, MongoDB Atlas for
            storage), and how users can request deletion of their data.
          </p>
          <p>
            SayIt does not log the content of the messages you paste for
            generation purposes beyond what is needed to produce your reply
            and, for signed-in users, to show your own reply history back to
            you.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
