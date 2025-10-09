import Image from "next/image";
import PortfolioNavigation from "@/app/portfolio/PortfolioNavigation";
import CallToAction from "@/components/CallToAction";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />

        <div className="z-10 relative mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.2em]">My Work</p>

            <div className="flex lg:flex-row flex-col justify-center items-center gap-8 lg:gap-16 mb-8">
              <h1 className="font-GFS-didot text-primary text-4xl md:text-6xl lg:text-7xl text-balance leading-[0.9]">
                Portfolio
              </h1>
              <div className="w-48 md:w-56 lg:w-64">
                <Image
                  src="/mainlogo2.png"
                  alt="Siru Bhurtel Photography Logo"
                  width={256}
                  height={180}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            <div className="bg-primary mx-auto mb-8 w-24 h-px" />
          </div>
        </div>
      </section>
      <section className="pt-12">
        <PortfolioNavigation />
        <p className="mx-auto px-6 text-muted-foreground text-lg text-center leading-relaxed">
          A curated collection of moments captured through my lens, showcasing the beauty of life&apos;s most precious
          memories.
        </p>
        {children}

        <CallToAction />
      </section>
    </main>
  );
}
