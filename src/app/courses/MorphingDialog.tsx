"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type courseType = {
  id: string;
  title: string;
  image: string;
  height: number;
  width: number;
};

export function MorphingCard({ course }: { course: courseType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState({});
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

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
      zIndex: 9999, // ensure above everything (navbar etc.)
    });
    setDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!dialogOpen || !overlayRef.current || !cardRect || !backdropRef.current) return;

    const tl = gsap.timeline();

    // Lock to starting rect
    gsap.set(overlayRef.current, {
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
    });

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isSmallScreen = viewportWidth < 640;

    // Set max width/height depending on screen size
    const maxHeight = isSmallScreen ? viewportHeight * 0.75 : viewportHeight;
    const maxWidth = isSmallScreen ? viewportWidth * 0.95 : viewportWidth;

    // Maintain aspect ratio
    const imgAspectRatio = cardRect.width / cardRect.height;
    let targetWidth = maxWidth;
    let targetHeight = targetWidth / imgAspectRatio;

    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = targetHeight * imgAspectRatio;
    }

    const topOffset = (viewportHeight - targetHeight) / 2;
    const leftOffset = (viewportWidth - targetWidth) / 2;

    // Animate overlay and backdrop together
    tl.to(overlayRef.current, {
      top: topOffset,
      left: leftOffset,
      width: targetWidth,
      height: targetHeight,
      duration: 0.35,
      ease: "power3.out",
    }).to(
      backdropRef.current,
      { opacity: 1, pointerEvents: "auto", duration: 0.35, ease: "power3.out" },
      0 // start at same time
    );

    return () => {
      tl.kill();
    };
  }, [dialogOpen, cardRect]);

  const handleClose = useCallback(() => {
    if (!cardRect) return;
    const tl = gsap.timeline({
      onComplete: () => {
        setDialogOpen(false);
        document.body.style.overflow = "auto";
      },
    });

    tl.to(overlayRef.current, {
      width: cardRect.width,
      height: cardRect.height,
      top: cardRect.top,
      left: cardRect.left,
      duration: 0.3,
      ease: "power3.out",
      transformOrigin: "center center",
    }).to(backdropRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3, ease: "power3.out" }, 0);
  }, [cardRect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dialogOpen) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogOpen, handleClose]);

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "relative flex flex-col items-center bg-background cursor-pointer",
          dialogOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleOpen}
      >
        <CardContent course={course} />
      </div>

      <div
        onClick={() => {
          handleClose();
        }}
        ref={backdropRef}
        style={{ opacity: 0, pointerEvents: "none" }}
        className={cn("z-40 fixed inset-0 bg-black/80 h-screen")}
      />

      {/* Expanding Overlay */}
      <div
        ref={overlayRef}
        style={overlayStyle}
        className={cn(
          "fixed flex flex-col items-center bg-background shadow-2xl rounded-xl overflow-visible",
          dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none "
        )}
      >
        {/* Close Button */}
        <button
          className="top-4 right-4 z-130 absolute bg-primary shadow-lg p-2 rounded-full w-8 h-8 active:scale-95 cursor-pointer"
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon className="w-4 h-4 text-secondary" />
        </button>

        <CardContent course={course} />
      </div>
    </>
  );
}

function CardContent({ course }: { course: courseType }) {
  return (
    <div
      className="relative bg-muted w-full overflow-hidden" // simple grey background
      style={{ aspectRatio: `${course.width} / ${course.height}` }}
    >
      <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
    </div>
  );
}
