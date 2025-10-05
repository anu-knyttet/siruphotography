"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";

// Map of bars that have routes
const barRoutes: { route: string; name: string; index: number }[] = [
  { route: "/", name: "Home", index: 0 },
  { route: "/about", name: "About", index: 10 },
  { route: "/portfolio", name: "Portfolio", index: 20 },
  { route: "/packages", name: "Packages", index: 30 },
  { route: "/team", name: "Team", index: 40 },
  { route: "/portfolio/recent", name: "Recent", index: 50 },
  { route: "/contact", name: "Contact", index: 60 },
];

export default function Navbar() {
  const NUM_BARS = 61;
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [globalHovered, setGlobalHovered] = React.useState<boolean>(false);
  const maxEssential = 1.8;
  const maxNonEssential = 2.5;
  const pathName = usePathname();
  // Find the best matching route based on path prefix (supports nested routes)
  const activeIndex = React.useMemo(() => {
    // Sort routes by length (longest first) to find the most specific match
    const sortedRoutes = barRoutes.sort((a, b) => b.route.length - a.route.length);
    const matchingRoute = sortedRoutes.find((route) => pathName.startsWith(route.route));
    return matchingRoute?.index ?? null;
  }, [pathName]);
  const parentRef = React.useRef<HTMLDivElement>(null);
  const barsRef = React.useRef<(SVGLineElement | null)[]>([]);
  const triangleRef = React.useRef<HTMLDivElement>(null);
  const labelsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const [trianglePosition, setTrianglePosition] = React.useState<string>("0px");

  React.useEffect(() => {
    if (activeIndex !== null && parentRef.current) {
      const position = `${
        (parentRef.current.offsetWidth / NUM_BARS) * activeIndex +
        parentRef.current.offsetWidth / NUM_BARS / 2 -
        1 - // center the triangle
        3.5 // offset in px
      }px`;
      setTrianglePosition(position);
    } else {
      setTrianglePosition("0px");
    }
  }, [activeIndex, pathName]);

  React.useEffect(() => {
    if (triangleRef.current) {
      gsap.to(triangleRef.current, {
        left: trianglePosition,
        duration: 0.8,
        ease: "circ.out",
      });
    }
  }, [trianglePosition]);

  React.useEffect(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;

      let scaleY = 1;

      // Apply Gaussian scaling based on hovered bar
      if (globalHovered) {
        if (barRoutes.some((route) => route.index === i)) {
          scaleY = maxEssential;
        }
      }

      if (hovered !== null) {
        if (barRoutes.some((route) => route.index === i)) {
          scaleY = maxEssential;
        } else {
          scaleY = 1 + wGaussian(i, hovered, 3, 0.7) * (maxNonEssential - 1);
          if (scaleY > maxNonEssential) scaleY = maxNonEssential;
        }
      }

      gsap.to(bar, {
        scaleY,
        duration: 0.5,
        ease: "elastic.out(0.6, 0.4)", // smaller amplitude = less extreme overshoot, period = softer bounce
        transformOrigin: "bottom",
      });
    });
  }, [hovered, globalHovered]);

  React.useEffect(() => {
    labelsRef.current.forEach((label) => {
      if (!label) return;

      if (globalHovered) {
        gsap.to(label, {
          opacity: 1,
          y: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(label, {
          opacity: 0,
          y: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    });
  }, [globalHovered]);

  function wGaussian(x: number, mu: number, sigma: number, dipStrength = 1) {
    const t = (x - mu) / sigma;
    const g = Math.exp(-0.5 * t * t);
    const cosPart = 1 - dipStrength + dipStrength * Math.cos(2 * t);
    return g * cosPart;
  }

  return (
    <div className="relative transition-all">
      <div className="bottom-0 left-1/2 fixed bg-gradient-to-r from-black/40 via-black/70 to-black/40 w-full h-24 -translate-x-1/2 pointer-events-none" />
      <div
        className="bottom-8 left-8 sm:left-1/2 z-100 fixed flex flex-col justify-between items-end gap-4 w-84 sm:w-128 h-24 sm:-translate-x-1/2"
        ref={parentRef}
        onMouseEnter={() => setGlobalHovered(true)}
        onMouseLeave={() => setGlobalHovered(false)}
      >
        <div className="flex flex-row w-full h-full">
          {Array.from({ length: NUM_BARS }).map((_, i) => {
            const routeObj = barRoutes.find((route) => route.index === i) ?? null;

            const barContent = (
              <div
                key={i}
                className="relative flex justify-center w-full h-full"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <svg
                  width="2"
                  height="100%"
                  viewBox="0 0 2 100"
                  preserveAspectRatio="none"
                  className="bottom-0 absolute"
                >
                  <line
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    x1="1"
                    y1={i % 10 === 0 ? 60 : 80}
                    x2="1"
                    y2="100"
                    stroke="#ffe0c2"
                    strokeWidth="1"
                    style={{ transformOrigin: "bottom" }}
                  />
                </svg>
              </div>
            );

            return routeObj ? (
              <Link key={i} href={routeObj.route} className="relative flex flex-1 justify-center">
                {barContent}

                <div
                  ref={(el) => {
                    const routeIndex = barRoutes.findIndex((r) => r.index === i);
                    if (routeIndex !== -1) {
                      labelsRef.current[routeIndex] = el;
                    }
                  }}
                  className="top-[30px] left-4 z-20 absolute flex justify-center items-center opacity-0 w-auto h-4 font-bold text-primary text-xs"
                >
                  {routeObj?.name}
                </div>
              </Link>
            ) : (
              <div key={i} className="relative flex flex-1 justify-center">
                {barContent}
              </div>
            );
          })}
        </div>

        <div
          ref={triangleRef}
          className="bottom-[-20px] left-0 absolute bg-primary w-2 h-2"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        />
      </div>
    </div>
  );
}
