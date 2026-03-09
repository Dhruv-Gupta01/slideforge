"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSlideStore } from "@/store/useSlideStore";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/utils";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import ShapeBlock from "./ShapeBlock";

type Transition = "fade" | "slide-left";

export default function PresentationMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [transition, setTransition] = useState<Transition>("fade");
  const [slideKey, setSlideKey] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const isPresenting = useSlideStore((s) => s.isPresenting);
  const stopPresenting = useSlideStore((s) => s.stopPresenting);
  const nextSlide = useSlideStore((s) => s.nextSlide);
  const prevSlide = useSlideStore((s) => s.prevSlide);

  const currentSlide = slides[currentSlideIndex];

  // Track slide changes for animation key — derive from state
  if (prevIndex !== currentSlideIndex) {
    setPrevIndex(currentSlideIndex);
    setSlideKey((k) => k + 1);
  }

  // Enter fullscreen when presenting starts
  useEffect(() => {
    if (!isPresenting) return;

    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen may not be available
      }
    };
    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isPresenting]);

  // Exit presentation when fullscreen is exited externally
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isPresenting) {
        stopPresenting();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isPresenting, stopPresenting]);

  // Scale canvas to fill viewport while maintaining 16:9
  const updateScale = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = vw / CANVAS_WIDTH;
    const scaleY = vh / CANVAS_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  useEffect(() => {
    if (!isPresenting) return;
    // Subscribe to resize events
    const handler = () => updateScale();
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isPresenting, updateScale]);

  // Keyboard navigation
  useEffect(() => {
    if (!isPresenting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          e.preventDefault();
          stopPresenting();
          break;
        case "t":
        case "T":
          setTransition((prev) =>
            prev === "fade" ? "slide-left" : "fade"
          );
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, nextSlide, prevSlide, stopPresenting]);

  if (!isPresenting || !currentSlide) return null;

  const fadeAnimation = `
    @keyframes presentFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes presentSlideIn {
      from { transform: scale(${scale}) translateX(50%); opacity: 0; }
      to { transform: scale(${scale}) translateX(0); opacity: 1; }
    }
  `;

  const animationStyle: React.CSSProperties =
    transition === "fade"
      ? {
          transform: `scale(${scale})`,
          animation: "presentFadeIn 400ms ease-in-out",
        }
      : {
          animation: "presentSlideIn 400ms ease-in-out",
          transform: `scale(${scale})`,
        };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none"
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (e.clientX > rect.width / 2) {
          nextSlide();
        } else {
          prevSlide();
        }
      }}
    >
      <style>{fadeAnimation}</style>
      <div
        key={slideKey}
        className="relative"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: currentSlide.background || "#ffffff",
          transformOrigin: "center center",
          ...animationStyle,
        }}
      >
        {currentSlide.elements.map((element) => (
          <div
            key={element.id}
            className="absolute"
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              zIndex: element.zIndex,
              transform: element.rotation
                ? `rotate(${element.rotation}deg)`
                : undefined,
            }}
          >
            {element.type === "text" && (
              <TextBlock
                element={element}
                slideId={currentSlide.id}
                isSelected={false}
                readOnly
              />
            )}
            {element.type === "image" && <ImageBlock element={element} />}
            {element.type === "shape" && <ShapeBlock element={element} />}
          </div>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-6 text-white/60 text-sm font-mono select-none">
        {currentSlideIndex + 1} / {slides.length}
      </div>

      {/* Transition indicator */}
      <div className="absolute bottom-4 left-6 text-white/40 text-xs font-mono select-none">
        {transition} · press T to switch
      </div>
    </div>
  );
}
