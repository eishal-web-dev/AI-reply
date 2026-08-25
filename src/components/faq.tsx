import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need to sign up to use SayIt?",
    a: "No — you get 3 free replies with no signup. After that, a free account gives you 5 replies every day.",
  },
  {
    q: "Which languages does SayIt support?",
    a: "English, Urdu, Roman Urdu, and Arabic, with automatic language detection. SayIt also understands mixed-language and slang input.",
  },
  {
    q: "Can SayIt read a screenshot of a message?",
    a: "Yes. Upload a screenshot and SayIt extracts and understands the text before writing your reply.",
  },
  {
    q: "Is my message data stored?",
    a: "Screenshots are used only to generate your reply and are never stored. If you're signed in, your reply history is saved to your account so you can revisit it — you can delete it anytime from your dashboard.",
  },
  {
    q: "What happens after my free replies run out?",
    a: "You'll be prompted to sign up for a free account, which resets your allowance to 5 replies every day. A Pro plan with unlimited replies is coming soon.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          FAQ
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          Questions, answered
        </h2>
      </div>

      <Accordion type="single" collapsible className="glass rounded-2xl px-6">
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
