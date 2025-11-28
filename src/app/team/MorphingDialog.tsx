"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import InstagramIcon from "@/components/icons/instagram";
import TiktokIcon from "@/components/icons/tiktok";
import FacebookIcon from "@/components/icons/facebook";
import YoutubeIcon from "@/components/icons/youtube";

type memberType = {
  id: string;
  name: string;
  role: string;
  bio: string[];
  image: string;
  socials: { instagram: string; tiktok?: string; facebook?: string; youtube?: string };
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
    document.body.style.overflow = "hidden";
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

    const widthFactor = 1.3;
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
      onComplete: () => {
        setDialogOpen(false);
        document.body.style.overflow = "auto";
      },
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
          "relative flex flex-col items-center bg-background p-6 border rounded-xl aspect-16/15 sm:aspect-[4/5] transition-opacity duration-200 cursor-pointer",
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
          "fixed flex flex-col items-center bg-background p-6 border rounded-xl overflow-hidden",
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
        <div ref={contentRef} className="opacity-0 mb-3 text-muted-foreground text-sm text-center">
          {member.bio.map((point, i) => (
            <div key={i}>• {point}</div>
          ))}
        </div>
      </div>
    </>
  );
}

function CardContent({ member }: { member: memberType }) {
  return (
    <>
      <div className="bg-gray-200 mb-4 border border-primary rounded-full w-48 min-w-48 h-48 min-h-48 overflow-hidden">
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <h2 className="mb-1 font-GFS-didot text-primary text-xl">{member.name}</h2>
      <div className="mb-4 text-muted-foreground text-sm">{member.role}</div>
      <div className="bottom-4 left-1/2 absolute flex gap-3 -translate-x-1/2">
        {member.socials.instagram && (
          <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon fill="#ffe0c2" className="w-5 h-5 text-primary hover:text-accent" />
          </a>
        )}
        {member.socials.tiktok && (
          <a href={member.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
            <TiktokIcon fill="#ffe0c2" className="w-5 h-5 text-primary hover:text-accent" />
          </a>
        )}
        {member.socials.facebook && (
          <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon fill="#ffe0c2" className="w-5 h-5 text-primary hover:text-accent" />
          </a>
        )}
        {member.socials.youtube && (
          <a href={member.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <YoutubeIcon fill="#ffe0c2" className="w-5 h-5 hover:text-accent" />
          </a>
        )}
      </div>
    </>
  );
}
