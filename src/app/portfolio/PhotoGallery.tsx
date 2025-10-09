"use client";

import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2Icon, XIcon } from "lucide-react";
import { gsap } from "gsap";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface GalleryImage {
  id: number;
  fileId: string;
  src: string;
  alt: string;
  title: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

function ikUrl(src: string, params: string) {
  return src.includes("?") ? `${src}&${params}` : `${src}?${params}`;
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const searchParams = useSearchParams();
  const initialFileId = searchParams.get("fileId");
  const [lightboxFileId, setLightboxFileId] = useState<string | null>(initialFileId);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  function onCloseLightbox() {
    setLightboxFileId(null);
    window.document.body.style.overflow = "auto";
  }

  return (
    <>
      <div className="gap-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {images.map((image) => (
          <GalleryItem
            key={image.id}
            image={image}
            onClick={() => {
              setLightboxFileId(image.fileId);
              window.document.body.style.overflow = "hidden";
            }}
          />
        ))}
      </div>

      {lightboxFileId && (
        <Lightbox lightboxRef={lightboxRef} images={images} lightboxFileId={lightboxFileId} onClose={onCloseLightbox} />
      )}
    </>
  );
}

const GalleryItem = memo(function GalleryItem({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  function setFileIdParam(fileId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (fileId) {
      params.set("fileId", fileId);
    } else {
      params.delete("fileId");
    }
    router.replace(`${pathName}?${params.toString()}`, { scroll: true });
  }
  return (
    <div
      className="group bg-card shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={() => {
        onClick();
        setFileIdParam(image.fileId);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={ikUrl(image.src, "tr=w-700,q-80,fo-auto")}
          alt={image.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="right-0 bottom-4 left-0 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 min-w-full">
            <h3 className="ml-2 font-medium text-primary text-sm">{image.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
});

interface LightboxProps {
  images: GalleryImage[];
  lightboxRef: React.RefObject<HTMLDivElement | null>;
  lightboxFileId?: string;
  onClose: () => void;
}

function Lightbox({ images, lightboxRef, lightboxFileId, onClose }: LightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState(() => images.findIndex((img) => img.fileId === lightboxFileId));
  const imageRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const hasMounted = useRef(false);

  function setFileIdParam(fileId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (fileId) {
      params.set("fileId", fileId);
    } else {
      params.delete("fileId");
    }
    router.replace(`${pathName}?${params.toString()}`, { scroll: true });
  }

  const handleCloseLightbox = useCallback(() => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          onClose();
          setSelectedIndex(-1);
          setFileIdParam(null);
        },
      });
    } else {
      // Fallback in case ref not ready
      onClose();
    }
  }, [onClose, setFileIdParam, lightboxRef]);

  // Animate lightbox
  useEffect(() => {
    if (!hasMounted.current) {
      return;
    }
    if (lightboxRef.current) {
      gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, [lightboxFileId]);

  // Animate main image
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { translateX: 100 }, { translateX: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const goToPrevious = useCallback(() => {
    if (selectedIndex === -1) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    setFileIdParam(images[selectedIndex === 0 ? images.length - 1 : selectedIndex - 1].fileId);
  }, [selectedIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === -1) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    setFileIdParam(images[selectedIndex === images.length - 1 ? 0 : selectedIndex + 1].fileId);
  }, [selectedIndex, images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    },
    [goToNext, goToPrevious, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Preload next/prev
  useEffect(() => {
    if (selectedIndex === -1) return;
    const next = (selectedIndex + 1) % images.length;
    const prev = (selectedIndex - 1 + images.length) % images.length;
    [next, prev].forEach((i) => {
      const img = new Image();
      img.src = images[i].src;
    });
  }, [selectedIndex, images]);

  if (selectedIndex === -1) return null;

  return (
    <div
      ref={lightboxRef}
      className="z-101 fixed inset-0 flex justify-center items-center bg-black/95 backdrop-blur-md p-4"
    >
      {/* Close */}
      <button
        className="top-4 right-4 z-20 absolute bg-primary/30 hover:bg-primary/40 p-1 rounded-full text-primary"
        onClick={handleCloseLightbox}
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Navigation */}
      <button
        className="top-1/2 left-4 z-10 absolute bg-primary/30 hover:bg-primary/40 p-1 rounded-full text-primary -translate-y-1/2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        className="top-1/2 right-4 z-10 absolute bg-primary/30 hover:bg-primary/40 p-1 rounded-full text-primary -translate-y-1/2"
        onClick={goToNext}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Image */}
      <div
        ref={imageRef}
        key={images[selectedIndex].id}
        className="relative flex justify-center items-center w-full max-w-7xl h-full"
      >
        <div className="relative w-[1000px] h-[600px]">
          <Loader2Icon className="top-1/2 left-1/2 absolute w-12 h-12 text-primary -translate-x-1/2 -translate-y-1/2 animate-spin" />
          <img
            src={images[selectedIndex].src}
            alt=""
            width={1500}
            height={1200}
            loading="lazy"
            decoding="async"
            className="z-10 absolute w-full max-w-full h-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Info */}
      <div className="top-0 left-1/2 z-10 absolute bg-black/50 p-1 w-full text-center -translate-x-1/2">
        <h3 className="mb-2 font-light text-primary text-xl">{images[selectedIndex].title}</h3>
        <p className="mr-1 text-primary/70 text-sm">
          {selectedIndex + 1} of {images.length}
        </p>
      </div>

      {/* Thumbnails */}
      <div className="bottom-4 left-1/2 absolute flex justify-center gap-2 bg-black/50 px-4 py-2 w-full max-w-full overflow-x-auto overflow-y-hidden -translate-x-1/2">
        {images.map((image, idx) => (
          <button
            key={image.id}
            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
              idx === selectedIndex ? "border-primary scale-110" : "border-primary/30 hover:border-primary/60"
            }`}
            onClick={() => {
              setSelectedIndex(idx);
              setFileIdParam(image.fileId);
            }}
          >
            <img
              src={ikUrl(image.src, "tr=w-128,q-80,fo-auto")}
              alt={image.alt}
              width={64}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
