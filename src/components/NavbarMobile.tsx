"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { SocialsMobile } from "./Socials";
import { cn } from "@/lib/utils";

const barRoutes: { route: string; name: string }[] = [
  { route: "/", name: "Home" },
  { route: "/about", name: "About" },
  { route: "/portfolio", name: "Portfolio" },
  { route: "/packages", name: "Packages" },
  { route: "/team", name: "Team" },
  { route: "/portfolio/recent", name: "Recent" },
  { route: "/contact", name: "Contact" },
];

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Animate menu open/close
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current || !topRef.current || !middleRef.current || !bottomRef.current) return;

    // Disable body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: "auto" });
      gsap.to(panelRef.current, { x: "0%", duration: 0.5, ease: "power3.out" });

      gsap.to(topRef.current, { rotate: 45, y: 0, duration: 0.3, ease: "power3.out" });
      gsap.to(middleRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: -45, y: 0, duration: 0.3, ease: "power3.out" });
    } else {
      document.body.style.overflow = "";
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: "none" });
      gsap.to(panelRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });

      gsap.to(topRef.current, { rotate: 0, y: -8, duration: 0.3, ease: "power3.in" });
      gsap.to(middleRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: 0, y: 8, duration: 0.3, ease: "power3.in" });
    }

    // Clean up: always re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="top-4 right-4 z-50 fixed bg-black/50 p-2 rounded text-white"
        aria-label="Toggle menu"
      >
        <div className="relative flex flex-col justify-center items-center w-6 h-6">
          <div ref={topRef} className="absolute bg-white w-6 h-0.5 -translate-y-2" />
          <div ref={middleRef} className="absolute bg-white w-6 h-0.5" />
          <div ref={bottomRef} className="absolute bg-white w-6 h-0.5 translate-y-2" />
        </div>
      </button>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="z-40 fixed inset-0 bg-black/50 pointer-events-none"
        style={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="top-0 right-0 z-40 fixed flex flex-col bg-background shadow-lg p-6 w-3/4 h-full"
        style={{ transform: "translateX(100%)" }}
      >
        <nav className="flex flex-col space-y-6 my-auto">
          {barRoutes.map((bar, index) => (
            <Link
              key={index}
              onClick={() => setIsOpen(false)}
              href={bar.route}
              className={cn(
                "font-medium text-xl transition-colors",
                pathname === bar.route ? "text-primary" : "text-secondary"
              )}
            >
              {bar.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col justify-center items-center gap-2 mt-auto pt-2 border-primary border-t">
          <SocialsMobile />
          <p className="text-primary text-sm text-center">
            © {new Date().getFullYear()} Anuvette. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
