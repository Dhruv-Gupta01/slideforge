"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/domain/constants";
import { usePresentationViewModel } from "@/presentation/viewmodels/usePresentationViewModel";
import ElementRenderer from "@/presentation/views/elements/ElementRenderer";

type Transition = "fade" | "slide-left";

const FADE_KEYFRAMES = `
  @keyframes presentFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default function PresentationMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [transition, setTransition] = useState<Transition>("fade");
  const [slideKey, setSlideKey] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const {
    currentSlide,
    currentSlideIndex,
    isPresenting,
    totalSlides,
    stop,
    nextSlide,
    prevSlide,
  } = usePresentationViewModel();

  if (prevIndex !== currentSlideIndex) {
    setPrevIndex(currentSlideIndex);
    setSlideKey((k) => k + 1);
  }

  useEffect(() => {
    if (!isPresenting) return;
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch { /* Fullscreen may not be available */ }
    };
    enterFullscreen();
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isPresenting]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isPresenting) {
        stop();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isPresenting, stop]);

  const updateScale = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setScale(Math.min(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT));
  }, []);

  useLayoutEffect(() => {
    if (!isPresenting) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateScale();
  }, [isPresenting, updateScale]);

  useEffect(() => {
    if (!isPresenting) return;
    const handler = () => updateScale();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isPresenting, updateScale]);

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
          stop();
          break;
        case "t":
        case "T":
          setTransition((prev) => (prev === "fade" ? "slide-left" : "fade"));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, nextSlide, prevSlide, stop]);

  if (!isPresenting || !currentSlide) return null;

  const slideInKeyframes = `
    @keyframes presentSlideIn {
      from { transform: scale(${scale}) translateX(50%); opacity: 0; }
      to { transform: scale(${scale}) translateX(0); opacity: 1; }
    }
  `;

  const animationStyle: React.CSSProperties =
    transition === "fade"
      ? { transform: `scale(${scale})`, animation: "presentFadeIn 400ms ease-in-out" }
      : { animation: "presentSlideIn 400ms ease-in-out", transform: `scale(${scale})` };

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
      <style>{FADE_KEYFRAMES}{slideInKeyframes}</style>
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
            <ElementRenderer
              element={element}
              slideId={currentSlide.id}
              readOnly
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-6 text-white/60 text-sm font-mono select-none">
        {currentSlideIndex + 1} / {totalSlides}
      </div>

      <div className="absolute bottom-4 left-6 text-white/40 text-xs font-mono select-none">
        {transition} · press T to switch
      </div>
    </div>
  );
}
