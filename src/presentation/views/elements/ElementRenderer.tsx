"use client";

import type { SlideElement } from "@/domain/entities";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import ShapeBlock from "./ShapeBlock";

interface ElementRendererProps {
  element: SlideElement;
  slideId: string;
  isSelected?: boolean;
  readOnly?: boolean;
}

export default function ElementRenderer({
  element,
  slideId,
  isSelected = false,
  readOnly = false,
}: ElementRendererProps) {
  switch (element.type) {
    case "text":
      return (
        <TextBlock
          element={element}
          slideId={slideId}
          isSelected={isSelected}
          readOnly={readOnly}
        />
      );
    case "image":
      return <ImageBlock element={element} />;
    case "shape":
      return <ShapeBlock element={element} />;
  }
}
