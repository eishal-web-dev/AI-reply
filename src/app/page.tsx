import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { UseCases } from "@/components/use-cases";
import { BeforeAfter } from "@/components/before-after";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />
        <BeforeAfter />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
