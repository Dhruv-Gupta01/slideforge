"use client";

import { useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/domain/constants";
import { useCanvasViewModel } from "@/presentation/viewmodels/useCanvasViewModel";
import { useCanvasScale } from "@/presentation/hooks/useCanvasScale";
import CanvasElement from "./CanvasElement";
import ElementRenderer from "@/presentation/views/elements/ElementRenderer";

export default function SlideCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useCanvasScale(containerRef);
  const vm = useCanvasViewModel();

  const handleDragStop = (elementId: string, x: number, y: number) => {
    if (vm.currentSlide) {
      vm.updateElement(vm.currentSlide.id, elementId, { x, y });
      vm.pushHistory();
    }
  };

  const handleResizeStop = (
    elementId: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => {
    if (vm.currentSlide) {
      vm.updateElement(vm.currentSlide.id, elementId, { width, height, x, y });
      vm.pushHistory();
    }
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
          backgroundColor: vm.currentSlide?.background || "#ffffff",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) vm.deselectAll();
        }}
      >
        {vm.currentSlide?.elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            slideId={vm.currentSlide!.id}
            isSelected={vm.isElementSelected(element.id)}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            onSelect={vm.selectElement}
          >
            <ElementRenderer
              element={element}
              slideId={vm.currentSlide!.id}
              isSelected={vm.isElementSelected(element.id)}
            />
          </CanvasElement>
        ))}
      </div>
    </div>
  );
}
