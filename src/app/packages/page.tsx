import Link from "next/link";
import React from "react";

interface PackageCardProps {
  title: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
  highlight: string;
}

function PackageCard({
  title,
  description,
  features,
  popular = false,
  buttonText = "Learn More",
  highlight,
}: PackageCardProps) {
  return (
    <div
      className={`relative bg-background border rounded-2xl  p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
        popular ? "border-accent shadow-lg ring-2 ring-accent/20" : "border-border hover:border-accent/50"
      }`}
    >
      {popular && (
        <div className="top-0 left-1/2 absolute bg-accent px-4 py-1 rounded-b-lg font-medium text-primary text-sm -translate-x-1/2 -translate-y-0">
          Most Popular
        </div>
      )}

      <div className="text-center">
        <h3 className="mb-2 font-GFS-didot font-light text-primary text-3xl">{title}</h3>
        <div className="inline-block bg-accent/70 mb-4 px-3 py-1 rounded-full font-medium text-primary/50 text-sm">
          {highlight}
        </div>
        <p className="mb-6 text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <svg
              className="flex-shrink-0 mr-3 w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={"/contact"}
        className={`block w-full py-3 px-4 rounded-xl font-medium tracking-wide transition-all duration-300 group-hover:scale-105 ${
          popular
            ? "bg-accent hover:bg-accent/80 text-primary shadow-md"
            : "bg-accent/20 hover:bg-accent text-primary hover:text-accent-foreground border border-accent/30 hover:border-accent"
        }`}
      >
        {buttonText}
        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

const packages = [
  {
    title: "Portrait Session",
    icon: "📸",
    highlight: "Personal Branding",
    description:
      "Elevate your professional image with stunning portraits that capture your unique personality and style.",
    features: [
      "Professional studio lighting",
      "20+ expertly edited photos",
      "Private online gallery",
      "Full print & commercial rights",
      "Wardrobe consultation included",
    ],
    popular: false,
    buttonText: "Book Portrait Session",
  },
  {
    title: "Family Session",
    icon: "👨‍👩‍👧‍👦",
    highlight: "Create Lasting Memories",
    description: "Preserve precious family bonds with beautifully composed photos that tell your unique story.",
    features: [
      "Extended 90-minute session",
      "30+ stunning edited photos",
      "Beautiful online gallery",
      "Full print rights included",
      "Professional retouching",
      "Perfect for holiday cards",
    ],
    popular: true,
    buttonText: "Plan Family Session",
  },
  {
    title: "Event Coverage",
    icon: "🎉",
    highlight: "Full-Day Experience",
    description:
      "Comprehensive event photography that captures every special moment, emotion, and detail of your celebration.",
    features: [
      "Complete event coverage",
      "Hundreds of candid moments",
      "Elegant online gallery",
      "Full usage rights",
      "Same-day preview highlights",
      "Professional post-processing",
      "Optional second photographer",
    ],
    popular: false,
    buttonText: "Discuss Your Event",
  },
];

export default function PackagesPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />

        <div className="z-10 relative mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Photography Packages</p>

            <h1 className="mb-8 font-GFS-didot font-light text-primary text-4xl md:text-6xl text-balance leading-tight">
              Photography Experiences
            </h1>

            <div className="bg-primary mx-auto mb-8 w-24 h-px" />
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
              Artfully crafted photography experiences designed to capture your story with elegance and emotion. Each
              session is personalized to create beautiful memories that will be treasured for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="gap-8 grid md:grid-cols-3">
            {packages.map((pkg, index) => (
              <PackageCard
                key={index}
                title={pkg.title}
                highlight={pkg.highlight}
                description={pkg.description}
                features={pkg.features}
                popular={pkg.popular}
                buttonText={pkg.buttonText}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-secondary/30 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-GFS-didot font-light text-primary text-3xl">Need Something Custom?</h2>
          <p className="mb-8 text-muted-foreground text-lg leading-relaxed">
            Don&apos;t see a package that fits your needs? I offer custom photography packages for special occasions,
            commercial projects, and unique creative visions. Let&apos;s discuss your specific requirements.
          </p>
          <Link
            href="/contact"
            className="hover:bg-primary/10 px-4 py-2 border border-primary rounded-xl w-max text-primary active:scale-95 transition duration-200"
          >
            Contact for Custom Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
