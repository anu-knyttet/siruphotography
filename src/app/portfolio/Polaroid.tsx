"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
interface PolaroidImage {
  id: string;
  src: string;
  alt: string;
  date: string;
}

interface PolaroidCarouselProps {
  images?: PolaroidImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  className?: string;
}

const getTransformStyle = (position: number) => {
  const baseRotation = position * 3;

  // Switch between two rotation values based on even/odd position
  const rotation = baseRotation + (position % 2 === 0 ? -3 : 3);

  // Switch between two translateY values based on even/odd position
  const translateY = Math.abs(position) * 20 + (position % 2 === 0 ? -10 : 10);

  const translateX = position * 120;
  const scale = position === 0 ? 1 : 0.85 - Math.abs(position) * 0.1;
  const zIndex = 10 - Math.abs(position);

  return {
    x: translateX,
    y: translateY,
    rotate: rotation,
    scale,
    zIndex,
  };
};

const PolaroidCarousel: React.FC<PolaroidCarouselProps> = ({
  images = [
    {
      id: "1",
      src: "/Polaroid/Polaroid5.webp",
      alt: "Polaroid 1",
      date: "July 2024",
    },
    {
      id: "2",
      src: "/Polaroid/Polaroid2.webp",
      alt: "Polaroid 2",
      date: "June 2024",
    },
    {
      id: "3",
      src: "/Polaroid/Polaroid3.webp",
      alt: "Polaroid 3",
      date: "May 2024",
    },

    {
      id: "4",
      src: "/Polaroid/Polaroid4.webp",
      alt: "Polaroid 4",
      date: "March 2024",
    },
    {
      id: "5",
      src: "/Polaroid/Polaroid1.webp",
      alt: "Polaroid 5",
      date: "April 2025",
    },
  ],
  showControls = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleImages = useCallback(() => {
    const visibleImages = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + images.length) % images.length;
      visibleImages.push({ ...images[index], position: i });
    }
    return visibleImages;
  }, [currentIndex, images]);

  useEffect(() => {
    getVisibleImages().forEach((image, i) => {
      const el = carouselRefs.current[i];
      if (!el) return;

      const { x, y, rotate, scale, zIndex } = getTransformStyle(image.position);

      gsap.to(el, {
        x,
        y,
        rotate,
        scale,
        duration: 0.6,
        ease: "expo.out",
        zIndex,
      });
    });
  }, [getVisibleImages]);

  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className={`relative w-full max-w-4xl mx-auto  p-8 ${className}`}>
      {/* Main carousel container */}
      <div className="z-0 relative flex justify-center items-center h-96 overflow-hidden">
        {getVisibleImages().map((image, i) => (
          <div
            key={image.id}
            ref={(el) => {
              carouselRefs.current[i] = el;
            }}
            className="absolute bg-white rounded-none w-72 sm:w-96 cursor-pointer"
            style={{
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.7)",
              zIndex: getTransformStyle(image.position).zIndex,
            }} // Set zIndex directly
          >
            <div className="p-3">
              <div className="relative bg-gray-100 mb-3 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-60 sm:h-72 object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      {showControls && (
        <>
          <button
            className="top-1/2 left-0 z-10 absolute bg-secondary/70 hover:bg-secondary backdrop-blur-sm p-4 rounded-full transition-colors -translate-y-1/2 duration-500 cursor-pointer"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            className="top-1/2 right-0 z-10 absolute bg-secondary/70 hover:bg-secondary backdrop-blur-sm p-4 rounded-full transition-colors -translate-y-1/2 duration-500 cursor-pointer"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-8">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Current image info */}
      <div className="mt-6 text-center">
        <h3 className="font-semibold text-foreground text-lg">{images[currentIndex]?.alt}</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          {currentIndex + 1} of {images.length} • {images[currentIndex]?.date}
        </p>
      </div>
    </div>
  );
};

export default PolaroidCarousel;
