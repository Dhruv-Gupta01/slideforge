"use client";

import { useRef, useCallback } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/domain/constants";
import { useCanvasViewModel } from "@/presentation/viewmodels/useCanvasViewModel";
import { useCanvasScale } from "@/presentation/hooks/useCanvasScale";
import { useCollabViewModel } from "@/presentation/viewmodels/useCollabViewModel";
import { collabController } from "@/presentation/controllers/collabController";
import CanvasElement from "./CanvasElement";
import ElementRenderer from "@/presentation/views/elements/ElementRenderer";
import CollabCursors from "@/presentation/views/collab/CollabCursors";

export default function SlideCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scale = useCanvasScale(containerRef);
  const vm = useCanvasViewModel();
  const collab = useCollabViewModel();

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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!collab.isConnected || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      collabController.updateCursor({ x, y });
    },
    [collab.isConnected, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (collab.isConnected) {
      collabController.updateCursor(null);
    }
  }, [collab.isConnected]);

  const remoteSelections = new Map<string, { color: string; name: string }>();
  for (const user of collab.remoteUsers) {
    if (user.selectedElementId) {
      remoteSelections.set(user.selectedElementId, {
        color: user.color,
        name: user.name,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-slate-200 overflow-hidden"
    >
      <div
        ref={canvasRef}
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {vm.currentSlide?.elements.map((element) => {
          const remoteSelection = remoteSelections.get(element.id);
          return (
            <CanvasElement
              key={element.id}
              element={element}
              slideId={vm.currentSlide!.id}
              isSelected={vm.isElementSelected(element.id)}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              onSelect={vm.selectElement}
              remoteSelection={remoteSelection}
            >
              <ElementRenderer
                element={element}
                slideId={vm.currentSlide!.id}
                isSelected={vm.isElementSelected(element.id)}
              />
            </CanvasElement>
          );
        })}
        {collab.isConnected && <CollabCursors remoteUsers={collab.remoteUsers} />}
      </div>
    </div>
  );
}
