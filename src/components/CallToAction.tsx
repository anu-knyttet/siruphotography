import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-secondary/30 px-6 py-24">
      <div className="mx-auto max-w-3xl text-left">
        <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Ready to Begin?</p>
        <h2 className="mb-8 font-serif font-light text-primary text-4xl md:text-5xl text-balance leading-tight">
          <p>Let&apos;s create something beautiful</p>
        </h2>
        <p className="mb-10 text-muted-foreground text-lg leading-relaxed">
          Every family has a unique story to tell. I would be honored to help you preserve your most precious moments
          with artistry and care that will be treasured for generations.
        </p>
        <div className="text-center active:scale-95 transition duration-150">
          <Link
            className="hover:bg-primary/10 px-4 py-2 border border-primary w-max text-primary active:scale-95 transition duration-200"
            href="/contact"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
