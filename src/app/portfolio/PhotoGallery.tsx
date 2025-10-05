"use client";

import type React from "react";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2Icon, XIcon } from "lucide-react";
import { gsap } from "gsap";

// Accept images as a prop instead of hardcoding
interface GalleryImage {
  id: number;
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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          setSelectedImage(null);
          setLightboxOpen(false);
          // Revert URL to gallery root
        },
      });
    } else {
      // fallback if no ref
      setSelectedImage(null);
      setLightboxOpen(false);
    }
  }, []);

  const goToPrevious = useCallback(() => {
    if (selectedImage !== null) {
      const prev = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
      setSelectedImage(prev);
    }
  }, [selectedImage, images.length]);

  const goToNext = useCallback(() => {
    if (selectedImage !== null) {
      const next = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
      setSelectedImage(next);
    }
  }, [selectedImage, images.length]);

  useEffect(() => {
    if (selectedImage !== null && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { transform: "translateX(100px)", opacity: 0 },
        { transform: "translateX(0px)", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [selectedImage, images]);

  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
      gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
      if (e.key === "ArrowLeft") {
        goToPrevious();
      }
      if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious, closeLightbox]);

  useEffect(() => {
    if (selectedImage !== null) {
      const nextIndex = (selectedImage + 1) % images.length;
      const prevIndex = (selectedImage - 1 + images.length) % images.length;

      [nextIndex, prevIndex].forEach((i) => {
        const img = new Image();
        img.src = images[i].src;
      });
    }
  }, [selectedImage, images]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="gap-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <GalleryItem key={image.id} image={image} onClick={() => openLightbox(index)} />
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          ref={lightboxRef}
          className="z-101 fixed inset-0 flex justify-center items-center bg-black/95 backdrop-blur-md p-4"
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="top-4 right-4 z-20 absolute bg-primary/30 hover:bg-primary/40 p-1 rounded-full text-primary"
            onClick={closeLightbox}
          >
            <XIcon className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
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
            key={images[selectedImage].id}
            className="relative flex justify-center items-center pb-0 sm:pb-17 w-full max-w-7xl h-full"
          >
            <div className="relative w-[1000px] h-[600px]">
              <div>
                <Loader2Icon className="top-1/2 left-1/2 absolute w-12 h-12 text-primary -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <img
                src={images[selectedImage].src}
                alt=""
                width={1500}
                height={1200}
                loading="lazy"
                decoding="async"
                className="z-10 absolute w-full max-w-full h-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Image Info */}
          <div className="top-0 left-1/2 z-10 absolute bg-black/50 p-1 w-full text-center -translate-x-1/2">
            <h3 className="mb-2 font-light text-primary text-xl">{images[selectedImage].title}</h3>
            <p className="mr-1 text-primary/70 text-sm">
              {selectedImage + 1} of {images.length}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="bottom-4 left-1/2 absolute flex justify-center gap-2 bg-black/50 px-4 py-2 w-full max-w-full overflow-x-auto overflow-y-hidden -translate-x-1/2">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`flex-shrink-0  w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedImage ? "border-primary scale-110" : "border-primary/30 hover:border-primary/60"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={ikUrl(image.src, "tr=w-128,q-80,fo-auto")} // very low-res thumbnail
                  alt=""
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const GalleryItem = memo(function GalleryItem({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  return (
    <div
      className="group bg-card shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => {
        const preload = new Image();
        preload.src = image.src;
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
