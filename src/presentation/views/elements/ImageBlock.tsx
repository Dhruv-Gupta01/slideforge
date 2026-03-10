"use client";

import React from "react";
import type { SlideElement } from "@/domain/entities";

interface ImageBlockProps {
  element: SlideElement;
}

export default React.memo(function ImageBlock({ element }: ImageBlockProps) {
  return (
    <div className="w-full h-full overflow-hidden" style={{ cursor: "move" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.content}
        alt="Slide element"
        className="w-full h-full"
        style={{
          objectFit: "contain",
          opacity: element.style.opacity ?? 1,
          borderRadius: element.style.borderRadius || 0,
        }}
        draggable={false}
      />
    </div>
  );
});
