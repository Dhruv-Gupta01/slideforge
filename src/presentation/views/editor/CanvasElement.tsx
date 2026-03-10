"use client";

import { Rnd } from "react-rnd";
import type { SlideElement } from "@/domain/entities";

interface CanvasElementProps {
  element: SlideElement;
  slideId: string;
  isSelected: boolean;
  children: React.ReactNode;
  onDragStop: (elementId: string, x: number, y: number) => void;
  onResizeStop: (elementId: string, width: number, height: number, x: number, y: number) => void;
  onSelect: (elementId: string) => void;
}

export default function CanvasElement({
  element,
  isSelected,
  children,
  onDragStop,
  onResizeStop,
  onSelect,
}: CanvasElementProps) {
  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={(_e, d) => {
        onDragStop(element.id, d.x, d.y);
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        onResizeStop(
          element.id,
          parseInt(ref.style.width),
          parseInt(ref.style.height),
          position.x,
          position.y
        );
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      style={{ zIndex: element.zIndex }}
      bounds="parent"
      className={`${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <div className="w-full h-full">{children}</div>
    </Rnd>
  );
}
