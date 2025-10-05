"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function PageTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const blocksRef = React.useRef<HTMLDivElement[]>([]);
  const isTransitioning = React.useRef(false);
  const firstLoad = React.useRef(true);
  const logoRef = React.useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      const numBlocks = typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 20;

      blocksRef.current = [];
      overlayRef.current.innerHTML = "";

      for (let i = 0; i < numBlocks; i++) {
        const block = document.createElement("div");
        block.style.transformOrigin = "left";
        block.style.backgroundColor = "var(--background)";
        block.style.height = "100%";
        block.style.flexGrow = "1";
        block.style.transform = "scaleX(0)";
        block.style.zIndex = "51";
        blocksRef.current.push(block);
        overlayRef.current.appendChild(block);
      }
    };

    createBlocks();

    const revealPage = () => {
      gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "left" });

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioning.current = false;
        },
      });

      // Animate blocks scaling down
      tl.to(blocksRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: "power2.out",
        transformOrigin: "left",
        stagger: 0.02, // small stagger between blocks
      });

      // Fade out logo after a small delay (like +=0.2)
      if (logoRef.current) {
        tl.to(
          logoRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "<"
        );
      }
    };

    if (!firstLoad.current) {
      revealPage();
    }
    firstLoad.current = false;

    const coverPage = (url: string) => {
      // Create and show logo
      const logo = document.createElement("img");
      logo.src = "/mainlogo2.png";
      logo.style.position = "fixed";
      logo.style.top = "50%";
      logo.style.left = "50%";
      logo.style.transform = "translate(-50%, -50%)";
      logo.style.width = "240px";
      logo.style.opacity = "0";
      logo.style.zIndex = "52";
      logo.style.pointerEvents = "none";
      document.body.appendChild(logo);
      logoRef.current = logo;

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(url);
        },
      });

      // Animate blocks first
      tl.to(blocksRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.out",
        transformOrigin: "left",
        stagger: 0.02, // small stagger between blocks
      });

      // Then fade in logo
      tl.to(
        logo,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "+0.2"
      ); // "<" means start at same time as previous, or remove "<" to start after
    };

    const handleLinkClick = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (href && href !== pathname && !isTransitioning.current) {
        isTransitioning.current = true;
        coverPage(href);
      }
    };

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [router, pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="top-0 left-0 z-50 fixed flex w-screen h-screen transition-overlay pointer-events-none"
      ></div>
      {children}
    </>
  );
}
