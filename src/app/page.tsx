"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronsDownIcon, MouseIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Page component
export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05 }); // Lower values = smoother, slower scroll (default is 0.1)

    // Sync Lenis scroll with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker for Lenis raf
    gsap.ticker.add((time) => {
      lenis.raf(time * 1500); // GSAP time is in seconds, Lenis expects ms
    });

    // Disable GSAP lag smoothing for instant scroll updates
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1500);
      });
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full">
      <ParallaxCardSection />
      <section className="top-0 sticky flex justify-center items-center bg-background px-6 h-screen">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Ready to Begin?</p>
          <h2 className="mb-8 font-GFS-didot font-light text-primary text-4xl md:text-5xl text-balance leading-tight">
            Let&apos;s Create Something Beautiful Together
          </h2>
          <p className="mb-10 text-muted-foreground text-lg leading-relaxed">
            Every family has a unique story to tell. I would be honored to help you preserve your most precious moments
            with artistry and care that will be treasured for generations.
          </p>
          <Link
            className="hover:bg-primary/10 px-4 py-2 border border-primary rounded-xl w-max text-primary active:scale-95 transition duration-200"
            href="/contact"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </main>
  );
}

const ParallaxCard = ({
  src,
  initialRotation,
  initialScale,
  exitScale,
  exitRotation,
  position,
  heading,
  subheading,
  cta,
  ctaHref,
  showScrollIndicator,
}: {
  src: string;
  initialRotation: number;
  initialScale: number;
  exitScale: number;
  exitRotation: number;
  position: "left" | "right";
  heading: string;
  subheading: string;
  cta?: string;
  ctaHref?: string;
  showScrollIndicator?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Animate entry
    tl.fromTo(
      card,
      { scale: initialScale, rotation: initialRotation },
      { scale: 1, rotation: 0, ease: "none", immediateRender: false }
    )
      // Animate exit
      .to(card, { scale: exitScale, rotation: exitRotation, ease: "none" });

    // Force ScrollTrigger to recalc positions for mid-scroll refresh
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [initialScale, initialRotation, exitScale, exitRotation]);

  return (
    <div ref={cardRef} className="top-0 sticky flex flex-col items-center h-screen">
      <Image
        src={src}
        alt="Background"
        fill
        className="w-full h-full object-cover pointer-events-none select-none"
        style={{ zIndex: 0, position: "absolute" }}
        priority
      />
      <div
        className={cn(
          "absolute inset-0 flex items-center bg-black/30 px-4 sm:px-8 md:px-12",
          position === "left" ? "justify-start" : "justify-end"
        )}
      >
        <div className="max-w-full sm:max-w-lg md:max-w-xl text-left">
          <h1 className="drop-shadow-lg mb-3 font-extrabold text-primary text-5xl md:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mb-6 text-primary/90 text-xl md:text-2xl leading-relaxed">{subheading}</p>
          {cta && ctaHref && (
            <Link
              href={ctaHref}
              className="hover:bg-primary/90 px-4 py-2 border border-primary rounded-xl w-max text-primary hover:text-background active:scale-95 transition duration-500"
            >
              {cta}
            </Link>
          )}
        </div>
      </div>
      {/* Scroll Down Indicator (only on first card) */}
      {showScrollIndicator && (
        <div className="bottom-16 sm:bottom-32 left-1/2 z-30 absolute flex flex-col items-center -translate-x-1/2 animate-bounce pointer-events-none select-none">
          <span className="font-semibold text-primary text-lg">
            <MouseIcon />
          </span>
          <ChevronsDownIcon className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  );
};

export function ParallaxCardSection() {
  return (
    <section className="relative bg-background h-[900svh] overflow-x-clip">
      <ParallaxCard
        // src="https://ik.imagekit.io/siruphotography/maternity/07.webp?updatedAt=1759591951081"
        src="/LandingHero.webp"
        initialRotation={0}
        initialScale={1}
        exitRotation={5}
        exitScale={0.85}
        position="left"
        showScrollIndicator
        heading="Moments That Matter"
        subheading="From the first smile to the last embrace, every moment is a memory worth cherishing."
        cta="View Portfolio"
        ctaHref="/portfolio"
      />
      <ParallaxCard
        // src="https://ik.imagekit.io/siruphotography/maternity/_DSC0442%20copy.webp?updatedAt=1759591956332"
        src="/LandingHero2.webp"
        initialRotation={-10}
        initialScale={0.75}
        exitRotation={-5}
        exitScale={0.75}
        position="right"
        heading="Artistry in Every Frame"
        subheading="Photography is more than pictures—it's the art of telling your story with light, color, and emotion."
        cta="Meet the Artist"
        ctaHref="/about"
      />
      <ParallaxCard
        // src="https://ik.imagekit.io/siruphotography/maternity/_DSC0636%20copy.webp?updatedAt=1759591954616"
        src="/LandingHero3.webp"
        initialRotation={15}
        initialScale={0.65}
        exitRotation={0}
        exitScale={0.55}
        position="left"
        heading="Your Legacy, Captured"
        subheading="Let’s create timeless images that your family will treasure for generations."
        cta="Book a Session"
        ctaHref="/contact"
      />
      <ZoomParallax />
      <TestimonialSection />
    </section>
  );
}

const zoomPictures = [
  { src: "/Hero1.webp", alt: "Zoom 1", scale: 9, top: "0%", left: "0%" },
  { src: "/Hero0.webp", alt: "Zoom 2", scale: 8, top: "0%", left: "33.33%" },
  { src: "/Hero2.webp", alt: "Zoom 3", scale: 6, top: "0%", left: "66.66%" },
  { src: "/Hero3.webp", alt: "Zoom 4", scale: 5, top: "33.33%", left: "0%" },
  { src: "/Hero5.webp", alt: "Zoom 5", scale: 3, top: "33.33%", left: "33.33%" },
  { src: "/Hero4.webp", alt: "Zoom 6", scale: 5, top: "33.33%", left: "66.66%" },
  { src: "/Hero6.webp", alt: "Zoom 7", scale: 6, top: "66.66%", left: "0%" },
  { src: "/Hero1.webp", alt: "Zoom 8", scale: 8, top: "66.66%", left: "33.33%" },
  { src: "/Hero0.webp", alt: "Zoom 9", scale: 9, top: "66.66%", left: "66.66%" },
];

const ZoomParallax = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const pictureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!targetRef.current) return;

    pictureRefs.current.forEach((el, i) => {
      const scaleEnd = zoomPictures[i].scale;

      gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale: scaleEnd,
          scrollTrigger: {
            trigger: targetRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section ref={targetRef} className="top-0 sticky bg-background h-[300svh]">
      <div className="top-0 sticky h-screen overflow-hidden">
        {/* Overlay Text */}
        <div className="z-20 absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <h2 className="drop-shadow-lg mb-4 font-bold text-primary text-4xl md:text-6xl text-center">
            See the World in Every Moment
          </h2>
          <p className="drop-shadow max-w-2xl text-primary/90 text-lg md:text-2xl text-center">
            Each image is a window into a unique story. Enjoy the vibrant tapestry of life as you scroll through our
            gallery.
          </p>
        </div>
        {zoomPictures.map(({ src, alt, top, left }, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) pictureRefs.current[index] = el;
            }}
            className="top-0 absolute flex justify-center items-center w-full h-full"
          >
            <div className="absolute w-[33.33vw] h-[33.33vh] will-change-transform" style={{ top, left }}>
              <Image src={src} alt={alt} fill className="object-cover" priority />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const testimonialMocks = [
  {
    quote:
      "Siru Photography captured our family moments with such warmth and authenticity. The photos are stunning and truly reflect our personalities. Highly recommend!",
    name: "Emily R.",
    role: "Mother of Two",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "The engagement photoshoot was an incredible experience! Siru made us feel comfortable and the results were beyond our expectations. We can't wait for the wedding shoot!",
    name: "James L.",
    role: "Fiancé",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "Our wedding photos are absolutely beautiful! Siru's attention to detail and ability to capture candid moments made our special day unforgettable.",
    name: "Sophia M.",
    role: "Bride",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "Siru Photography's maternity shoot was a magical experience. The photos are filled with love and anticipation, perfectly capturing this special time in our lives.",
    name: "Olivia K.",
    role: "Expecting Mother",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "The family portraits taken by Siru are cherished keepsakes. The natural lighting and beautiful compositions make each photo a work of art.",
    name: "Michael T.",
    role: "Father",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export function TestimonialSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!stackRef.current) return;

    const scrollHeight = window.innerHeight * 0.4; // 40vh per card

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const tl = gsap.timeline();

      tl.fromTo(
        card,
        { y: 0, rotation: -10 * i },
        {
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: stackRef.current,
            start: `top+=${i * scrollHeight} top`,
            end: `top+=${(i + 1) * scrollHeight} top`,
            scrub: true,
            // markers: true
          },
        }
      ).to(card, {
        y: -window.innerHeight * 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: stackRef.current,
          start: `top+=${(i + 1) * scrollHeight} top`,
          end: `top+=${(i + 2) * scrollHeight} top`,
          scrub: true,
          // markers: true
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div ref={stackRef} className="relative flex flex-row h-[300svh]">
      {/* Left sticky */}
      <div className="hidden top-0 sticky sm:flex flex-col flex-1 justify-center items-center bg-background px-8 h-screen">
        <h1 className="font-bold text-[5.25rem] text-primary">Testimonials</h1>
        <p className="mt-8 max-w-[420px] text-primary/90 text-sm text-center">
          Hear from some of the families I&apos;ve had the privilege to work with. Their words reflect the heart and
          soul I pour into every session.
        </p>
      </div>

      {/* Right sticky cards */}
      <div className="top-0 sticky flex-1 bg-secondary h-screen">
        {testimonialMocks.map((testimonial, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute flex flex-col justify-between bg-background/50 shadow-md backdrop-blur-md p-8 rounded-[25px] w-[300px] sm:w-[350px] h-[350px] sm:h-[450px] text-white will-change-transform"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              zIndex: 100 - i,
            }}
          >
            <p className="mb-4 text-primary text-lg italic">&quot;{testimonial.quote}&quot;</p>
            <div className="flex justify-center items-center gap-4 mt-8">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="shadow border-2 border-primary/30 rounded-full w-14 h-14 object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
