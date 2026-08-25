import { MessageTool } from "@/components/message-tool";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
      <div className="ember-glow pointer-events-none absolute inset-x-0 top-0 h-[560px]" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <h1 className="font-display max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
          Never wonder what to{" "}
          <span className="text-gradient italic">say</span> again.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-foreground-muted sm:text-lg">
          Paste a message or upload a screenshot. SayIt writes the perfect
          reply in seconds.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <MessageTool />
        </div>
      </div>
    </section>
  );
}
