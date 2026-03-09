"use client";

import { Rnd } from "react-rnd";
import { useSlideStore } from "@/store/useSlideStore";
import type { SlideElement } from "@/types";

interface CanvasElementProps {
  element: SlideElement;
  slideId: string;
  isSelected: boolean;
  children: React.ReactNode;
}

export default function CanvasElement({
  element,
  slideId,
  isSelected,
  children,
}: CanvasElementProps) {
  const updateElement = useSlideStore((s) => s.updateElement);
  const selectElement = useSlideStore((s) => s.selectElement);
  const pushHistory = useSlideStore((s) => s.pushHistory);

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={(_e, d) => {
        updateElement(slideId, element.id, { x: d.x, y: d.y });
        pushHistory();
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        updateElement(slideId, element.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: position.x,
          y: position.y,
        });
        pushHistory();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      style={{ zIndex: element.zIndex }}
      bounds="parent"
      className={`${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <div className="w-full h-full">{children}</div>
    </Rnd>
  );
}
