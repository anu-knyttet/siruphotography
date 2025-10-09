"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ChevronUpIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
  { name: "New Born", route: "/portfolio/newborn" },
  { name: "Family", route: "/portfolio/family" },
  { name: "Cakesmash", route: "/portfolio/cakesmash" },
  { name: "Fine Art", route: "/portfolio/fineart" },
  { name: "Maternity", route: "/portfolio/maternity" },
  { name: "Headshot", route: "/portfolio/headshot" },
  { name: "Graduation", route: "/portfolio/graduation" },
  { name: "Baby and Parents ", route: "/portfolio/babyAndParents" },
  { name: "Awards", route: "/portfolio/awards" },
  { name: "Recent", route: "/portfolio/recent" },
];

export default function MorphingCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const initialCategory = categories.find((cat) => cat.route === pathname);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory?.name || "");

  const handleOpen = () => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setCardRect(rect);
    setOverlayStyle({
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 50,
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!dialogOpen || !overlayRef.current || !cardRect || !contentRef.current || !closeRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tl = gsap.timeline();

    gsap.set(overlayRef.current, {
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
    });
    gsap.set([contentRef.current, closeRef.current], { opacity: 0 });

    // Step 1: move to center
    tl.to(overlayRef.current, {
      top: vh / 2 - cardRect.height / 2,
      left: vw / 2 - cardRect.width / 2,
      duration: 0.28,
      ease: "power3.out",
    });

    // Step 2: expand to full size
    const newHeight = cardRect.height + contentRef.current.scrollHeight + 20;
    tl.to(
      overlayRef.current,
      {
        width: window.innerWidth,
        height: newHeight,
        top: window.innerHeight / 2 - newHeight / 2,
        left: 0,
        duration: 0.32,
        ease: "power3.out",
      },
      "+=0.05"
    );

    // Step 3: fade in content + close button
    tl.to(
      [contentRef.current, closeRef.current],
      {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, [dialogOpen, cardRect]);

  const handleClose = useCallback(() => {
    if (!cardRect) return;
    const tl = gsap.timeline({
      onComplete: () => setDialogOpen(false),
    });

    // Step 1: fade out content
    tl.to([contentRef.current, closeRef.current], {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
    });

    // Step 2: shrink to center
    tl.to(overlayRef.current, {
      width: cardRect.width,
      height: cardRect.height,
      top: window.innerHeight / 2 - cardRect.height / 2,
      left: window.innerWidth / 2 - cardRect.width / 2,
      duration: 0.28,
      ease: "power3.inOut",
    });

    // Step 3: return to original rect
    tl.to(overlayRef.current, {
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
      duration: 0.32,
      ease: "power3.inOut",
    });
  }, [cardRect, setDialogOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dialogOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogOpen, handleClose]);

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "relative flex flex-col items-center bg-background mx-auto mb-2 py-2 border rounded-xl w-48 transition-opacity duration-200 cursor-pointer",
          dialogOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleOpen}
      >
        <CardContent expanded={dialogOpen} selectedCategory={selectedCategory} />
      </div>

      <div
        onClick={handleClose}
        className={cn(
          "z-40 fixed inset-0 bg-black/80 transition-opacity duration-300",
          dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <div
        ref={overlayRef}
        style={overlayStyle}
        className={cn(
          "fixed flex flex-col items-center bg-background py-2 border rounded-xl w-screen overflow-hidden",
          dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none transition-opacity duration-500"
        )}
      >
        <button
          ref={closeRef}
          className="top-2 right-4 z-10 absolute bg-primary/80 p-2 rounded-full h-8 aspect-square active:scale-95 cursor-pointer"
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon className="w-4 h-4 text-secondary" />
        </button>

        <CardContent expanded={dialogOpen} selectedCategory={selectedCategory} />

        <div ref={contentRef} className="flex flex-col gap-1 opacity-0 mt-4 px-2 w-full text-foreground text-base">
          {categories.map((option, i) => (
            <Link
              href={option.route}
              key={option.name}
              className={cn(
                "px-4 py-2 rounded-md w-full text-center transition-colors duration-150 cursor-pointer",
                "bg-background hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary border border-transparent",
                selectedCategory === option.name ? "bg-primary/10 font-bold text-primary" : "",
                i !== 0 && "mt-1"
              )}
              tabIndex={0}
              onClick={() => {
                setSelectedCategory(option.name);
                setDialogOpen(false);
              }}
            >
              {option.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

const CardContent = ({ expanded, selectedCategory }: { expanded: boolean; selectedCategory: string }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {selectedCategory || "Categories"}
      <ChevronUpIcon className={`transition-transform duration-300 ${!expanded ? "rotate-180" : "rotate-0"}`} />
    </div>
  );
};
