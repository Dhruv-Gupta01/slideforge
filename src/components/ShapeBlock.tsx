"use client";

import type { SlideElement } from "@/types";

interface ShapeBlockProps {
  element: SlideElement;
}

export default function ShapeBlock({ element }: ShapeBlockProps) {
  const shapeType = element.content;
  const {
    backgroundColor = "#3b82f6",
    opacity = 1,
    borderRadius = 0,
  } = element.style;

  if (shapeType === "triangle") {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ cursor: "move" }}
      >
        <div
          className="w-full h-full"
          style={{
            opacity,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            backgroundColor,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor,
        opacity,
        borderRadius: shapeType === "circle" ? "50%" : borderRadius,
        cursor: "move",
      }}
    />
  );
}
