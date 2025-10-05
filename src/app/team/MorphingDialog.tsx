"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type memberType = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: { instagram: string; linkedin: string };
};

export function MorphingCard({ member }: { member: memberType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Open dialog: set overlay and save rect
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

  // Morph animation with GSAP timeline (runs after overlay is rendered)
  useEffect(() => {
    if (!dialogOpen || !overlayRef.current || !cardRect || !contentRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tl = gsap.timeline();
    gsap.set(overlayRef.current, {
      top: cardRect.top,
      left: cardRect.left,
      width: cardRect.width,
      height: cardRect.height,
    });
    tl.to(overlayRef.current, {
      top: vh / 2 - cardRect.height / 2,
      left: vw / 2 - cardRect.width / 2,
      // width/height stay the same for now
      duration: 0.3,
      ease: "power3.inOut",
    });

    const widthFactor = 1.5;
    const heightFactor = 1.2;
    const newWidth = cardRect.width * widthFactor;
    const newHeight = cardRect.height * heightFactor;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const clampedWidth = Math.min(newWidth, maxWidth);
    const clampedHeight = Math.min(newHeight, maxHeight);

    tl.to(
      overlayRef.current,
      {
        width: clampedWidth,
        height: clampedHeight,
        top: (window.innerHeight - clampedHeight) / 2,
        left: (window.innerWidth - clampedWidth) / 2,
        duration: 0.3,
        ease: "power1.out",
        transformOrigin: "center center",
      },
      "+=0.2"
    ).to(
      contentRef.current,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power1.inOut",
      },
      "+=0.2"
    );

    // You can add more .to() steps here for further morphs!
    return () => {
      tl.kill();
    };
  }, [dialogOpen, cardRect]);

  // Close dialog with morph animation using timeline
  const handleClose = useCallback(() => {
    if (!cardRect) return;
    const tl = gsap.timeline({
      onComplete: () => setDialogOpen(false),
    });

    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power1.out",
    })
      .to(overlayRef.current, {
        width: cardRect.width,
        height: cardRect.height,
        top: window.innerHeight / 2 - cardRect.height / 2,
        left: window.innerWidth / 2 - cardRect.width / 2,
        duration: 0.3,
        ease: "power1.out",
        transformOrigin: "center center",
      })
      .to(overlayRef.current, {
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        duration: 0.4,
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogOpen, handleClose]);
  return (
    <>
      {/* Card in grid */}
      <div
        ref={cardRef}
        className={cn(
          "relative flex flex-col items-center bg-background p-6 border aspect-[4/4.5] transition-opacity duration-200 cursor-pointer",
          dialogOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleOpen}
      >
        <CardContent member={member} />
      </div>

      <div
        onClick={() => {
          handleClose();
        }}
        className={cn(
          "z-40 fixed inset-0 bg-black/80 transition-opacity duration-300",
          dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <div
        ref={overlayRef}
        style={overlayStyle}
        className={cn(
          "fixed flex flex-col items-center bg-background p-6 border overflow-hidden",
          dialogOpen ? " opacity-100 " : "opacity-0  pointer-events-none transition-opacity duration-500"
        )}
      >
        <button
          ref={closeRef}
          className="top-4 right-4 z-10 absolute bg-primary/80 p-2 rounded-full h-8 aspect-square active:scale-95 cursor-pointer"
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon className="w-4 h-4 text-secondary" />
        </button>

        <CardContent member={member} />
        {/* Optionally fade in extra dialog content here */}
        <div ref={contentRef} className="opacity-0 mb-3 text-muted-foreground text-sm text-center">
          {
            <>
              <div>• Passionate about capturing candid moments and authentic smiles.</div>
              <div>• Loves experimenting with lighting and creative angles.</div>
              <div>• Always ready to lend a hand and keep the energy high on set.</div>
            </>
          }
        </div>
      </div>
    </>
  );
}

function CardContent({ member }: { member: memberType }) {
  return (
    <>
      <div className="bg-gray-200 mb-4 rounded-full w-24 min-w-24 h-24 min-h-24 overflow-hidden">
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <h2 className="mb-1 font-serif text-primary text-xl">{member.name}</h2>
      <div className="mb-4 text-accent text-sm">{member.role}</div>
      <div className="bottom-4 left-1/2 absolute flex gap-3 -translate-x-1/2">
        {member.socials.instagram && (
          <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg className="w-5 h-5 text-primary hover:text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.13.62a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z" />
            </svg>
          </a>
        )}
        {member.socials.linkedin && (
          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="w-5 h-5 text-primary hover:text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
          </a>
        )}
      </div>
    </>
  );
}
