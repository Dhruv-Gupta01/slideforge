"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useSlideStore } from "@/store/useSlideStore";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/utils";
import CanvasElement from "./CanvasElement";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import ShapeBlock from "./ShapeBlock";

export default function SlideCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);
  const selectElement = useSlideStore((s) => s.selectElement);

  const currentSlide = slides[currentSlideIndex];

  const updateScale = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const padding = 40;
    const availableWidth = container.clientWidth - padding * 2;
    const availableHeight = container.clientHeight - padding * 2;

    const scaleX = availableWidth / CANVAS_WIDTH;
    const scaleY = availableHeight / CANVAS_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const renderElement = (element: (typeof currentSlide.elements)[0]) => {
    const isSelected = selectedElementId === element.id;

    return (
      <CanvasElement
        key={element.id}
        element={element}
        slideId={currentSlide.id}
        isSelected={isSelected}
      >
        {element.type === "text" && (
          <TextBlock
            element={element}
            slideId={currentSlide.id}
            isSelected={isSelected}
          />
        )}
        {element.type === "image" && <ImageBlock element={element} />}
        {element.type === "shape" && <ShapeBlock element={element} />}
      </CanvasElement>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-slate-200 overflow-hidden"
    >
      <div
        className="relative shadow-2xl"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          backgroundColor: currentSlide?.background || "#ffffff",
        }}
        onClick={handleCanvasClick}
      >
        {currentSlide?.elements.map(renderElement)}
      </div>
    </div>
  );
}
