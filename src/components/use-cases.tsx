import {
  MessageCircle,
  Mail,
  Briefcase,
  Building2,
  GraduationCap,
  Share2,
} from "lucide-react";

const useCases = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Reply to friends, family, or clients without the back-and-forth.",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Turn a messy draft into a clear, well-structured email.",
  },
  {
    icon: Briefcase,
    title: "Freelancers",
    description: "Chase payments and set expectations without sounding awkward.",
  },
  {
    icon: Building2,
    title: "Businesses",
    description: "Respond to customers quickly, consistently, and on-brand.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Write to professors and admin offices in the right register.",
  },
  {
    icon: Share2,
    title: "Social media",
    description: "Reply to comments and DMs without overthinking every word.",
  },
];

export function UseCases() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Built for real conversations
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          One tool, every message
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.title}
            className="rounded-2xl border border-border-subtle p-6 transition-colors hover:border-accent/40"
          >
            <useCase.icon className="h-6 w-6 text-accent" />
            <h3 className="font-display mt-4 text-lg font-medium">
              {useCase.title}
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
