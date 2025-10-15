import Image from "next/image";
import CallToAction from "../../components/CallToAction";

export const metadata = {
  title: "About - Siru Photography",
  description:
    "Learn more about Siru Bhurtel, a passionate portrait photographer specializing in newborn, maternity, and family photography.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      <section className="relative px-6 py-4 overflow-hidden text-center">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-secondary/30" />

        <div className="z-10 relative mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.2em]">Portrait Photography</p>

            <div className="flex lg:flex-row flex-col justify-center items-center gap-8 lg:gap-16 mb-8">
              <h1 className="font-GFS-didot font-light text-primary text-4xl md:text-6xl lg:text-7xl text-balance leading-[0.9]">
                About Me
              </h1>
              <div className="w-48 md:w-56 lg:w-64 translate-y-2">
                <Image
                  src="/mainlogo.png"
                  alt="Siru Bhurtel Photography Logo"
                  width={256}
                  height={180}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            <div className="bg-primary mx-auto w-24 h-px" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="items-center gap-16 lg:gap-24 grid lg:grid-cols-2">
            {/* Text Content */}
            <div className="lg:order-1">
              <div className="max-w-xl">
                <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Meet the Artist</p>
                <h2 className="mb-8 font-GFS-didot font-light text-foreground text-4xl md:text-5xl text-balance leading-tight">
                  Hi, I&apos;m <em className="font-GFS-didot text-primary italic">Siru!</em>
                </h2>
                <p className="mb-6 text-muted-foreground text-lg leading-relaxed">
                  A passionate portrait photographer capturing life&apos;s precious moments with artistry and grace.
                </p>
                <p className="text-foreground text-base leading-relaxed">
                  Through my lens, I create timeless portraits that celebrate the beauty of human connection and the
                  fleeting moments that define our lives.
                </p>
              </div>
            </div>

            {/* Portrait Image */}
            <div className="flex justify-center lg:order-2">
              <div className="relative">
                <div className="shadow-2xl w-80 md:w-96 h-96 md:h-[28rem] overflow-hidden">
                  <Image
                    src="/AboutMe.webp"
                    alt="Siru Bhurtel - Portrait Photographer"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Elegant frame accent */}
                <div className="-z-10 absolute -inset-4 border border-accent/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-4 font-medium text-primary text-sm uppercase tracking-[0.15em]">My Journey</p>
            <h2 className="font-GFS-didot font-light text-primary text-4xl md:text-5xl text-balance leading-tight">
              A Story of Passion & Excellence
            </h2>
          </div>

          <div className="space-y-12">
            <div className="max-w-none prose prose-lg">
              <p className="first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-GFS-didot text-foreground first-letter:text-primary text-lg first-letter:text-6xl leading-relaxed">
                My name is Srijana Bhurtel, widely known as Siru Bhurtel, a dedicated portrait photographer with over 13
                years of experience, specialising in newborn, maternity, and family photography. Capturing the delicate
                and fleeting moments of new life has been my passion and purpose, and I&apos;m proud to have become a
                trusted name for families seeking timeless memories.
              </p>
            </div>

            <div className="gap-12 grid md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-GFS-didot font-light text-primary text-2xl">Recognition & Awards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I have received recognition for my work, including an award in a Photography Contest in Gandaki
                  Province, and was selected for the Nepal Fine Art Photography Contest. My contributions to newborn
                  photography have also been acknowledged through various organisations for their social impact.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-GFS-didot font-light text-primary text-2xl">International Training</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To continually grow in my craft, I have trained internationally with world-renowned photographers such
                  as Ana Brandt in London, Tarveen (Looney Lens) in Mumbai, and Carol in Scotland for fine art
                  photography. These experiences have enriched my artistic vision and deepened my ability to create
                  portraits that are both emotive and elegant.
                </p>
              </div>
            </div>
            <div className="pt-8 text-center">
              <blockquote className="font-GFS-didot font-light text-primary text-2xl md:text-3xl italic text-balance leading-relaxed">
                &quot;Through my lens, I aim to tell your family&apos;s story with warmth, care, and creativity.&quot;
              </blockquote>
              <div className="bg-primary mx-auto mt-8 w-16 h-px" />
            </div>
          </div>
        </div>
      </section>

      <CallToAction background="bg-background/30" />
    </main>
  );
}
