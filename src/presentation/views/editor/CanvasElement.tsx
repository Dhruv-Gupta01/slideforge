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
  remoteSelection?: { color: string; name: string };
}

export default function CanvasElement({
  element,
  isSelected,
  children,
  onDragStop,
  onResizeStop,
  onSelect,
  remoteSelection,
}: CanvasElementProps) {
  let ringClass = "";
  let ringStyle: React.CSSProperties = {};

  if (isSelected) {
    ringClass = "ring-2 ring-blue-500";
  } else if (remoteSelection) {
    ringStyle = { boxShadow: `0 0 0 2px ${remoteSelection.color}` };
  }

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
      style={{ zIndex: element.zIndex, ...ringStyle }}
      bounds="parent"
      className={ringClass}
    >
      <div className="w-full h-full relative">
        {children}
        {remoteSelection && !isSelected && (
          <span
            className="absolute -top-5 left-0 text-[10px] text-white px-1 rounded"
            style={{ backgroundColor: remoteSelection.color }}
          >
            {remoteSelection.name}
          </span>
        )}
      </div>
    </Rnd>
  );
}
