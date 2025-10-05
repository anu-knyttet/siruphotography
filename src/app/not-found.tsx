import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="relative bg-background w-full min-h-[100svh]">
        {/* 404 Content */}
        <main className="flex justify-center items-center px-6 min-h-[calc(100svh-80px)]">
          <div className="mx-auto max-w-2xl text-center">
            {/* Camera Icon or Visual Element */}
            <div className="mb-8">
              <div className="flex justify-center items-center bg-accent/10 mx-auto mb-6 rounded-full w-32 h-32">
                <svg className="w-16 h-16 text-accent" fill="none" stroke="#FFe0b2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 404 Number */}
            <h1 className="mb-4 font-serif font-light text-primary text-8xl md:text-9xl leading-none">404</h1>

            {/* Main Message */}
            <h2 className="mb-6 font-serif font-light text-primary text-2xl md:text-3xl">
              This shot wasn&apos;t captured
            </h2>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-md text-muted-foreground text-lg leading-relaxed">
              The page you&apos;re looking for seems to have wandered off. Don&apos;t worry, every great photographer
              misses a shot sometimes.
            </p>

            {/* Action Buttons */}
            <div className="flex sm:flex-row flex-col justify-center gap-4">
              <Link
                href="/"
                className="bg-accent hover:bg-accent/80 px-8 py-3 rounded-sm font-medium text-primary tracking-wide transition-colors duration-300"
              >
                Back to Home
              </Link>
              <Link
                href="/portfolio"
                className="bg-accent/20 hover:bg-accent/40 px-8 py-3 rounded-sm font-medium text-primary tracking-wide transition-colors duration-300"
              >
                View Portfolio
              </Link>
            </div>

            {/* Decorative Element */}
            <div className="mt-12">
              <div className="bg-primary mx-auto w-16 h-px" />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
