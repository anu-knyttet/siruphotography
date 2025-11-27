"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
  { route: "/courses", name: "Courses", index: 70 },
];

export default function Navbar() {
  const NUM_BARS = 71;
  const [hovered, setHovered] = useState<number | null>(null);
  const [globalHovered, setGlobalHovered] = useState<boolean>(false);
  const maxEssential = 1.3;
  const maxNonEssential = 2;
  const pathName = usePathname();
  // Find the best matching route based on path prefix (supports nested routes)
  const activeIndex = useMemo(() => {
    // Sort routes by length (longest first) to find the most specific match
    const sortedRoutes = barRoutes.sort((a, b) => b.route.length - a.route.length);
    const matchingRoute = sortedRoutes.find((route) => pathName.startsWith(route.route));
    return matchingRoute?.index ?? null;
  }, [pathName]);
  const parentRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(SVGLineElement | null)[]>([]);
  const triangleRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [trianglePosition, setTrianglePosition] = useState<number>(0);

  useEffect(() => {
    if (activeIndex !== null && parentRef.current && triangleRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const barWidth = parentWidth / NUM_BARS;
      const triangleWidth = triangleRef.current.offsetWidth;

      const position = barWidth * activeIndex + barWidth / 2 - triangleWidth / 2;

      setTrianglePosition(position);
    } else {
      setTrianglePosition(0);
    }
  }, [activeIndex, pathName]);

  useEffect(() => {
    if (triangleRef.current) {
      gsap.to(triangleRef.current, {
        x: trianglePosition,
        duration: 0.8,
        ease: "circ.out",
      });
    }
  }, [trianglePosition]);

  useEffect(() => {
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

  function wGaussian(x: number, mu: number, sigma: number, dipStrength = 1) {
    const t = (x - mu) / sigma;
    const g = Math.exp(-0.5 * t * t);
    const cosPart = 1 - dipStrength + dipStrength * Math.cos(2 * t);
    return g * cosPart;
  }

  return (
    <div className="relative transition-all">
      <div className="bottom-6 left-1/2 fixed bg-gradient-to-r from-black/5 via-black to-black/5 w-full h-20 -translate-x-1/2 pointer-events-none" />
      <div
        className="bottom-8 left-8 sm:left-1/2 z-100 fixed flex flex-col justify-between items-end gap-4 w-84 sm:w-128 h-16 sm:-translate-x-1/2"
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
                  width="1"
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
                    y1={i % 10 === 0 ? 75 : 85}
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
                  className="top-[0px] left-1/2 z-20 absolute flex justify-center items-center w-auto h-4 font-medium text-primary text-xs -translate-x-1/2"
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
          className="top-[25px] left-0 absolute bg-primary w-2 h-2"
          style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }}
        />
      </div>
    </div>
  );
}
