import type { Slide, SlideElement } from "@/domain/entities";
import { DEFAULT_TEXT_STYLE, DEFAULT_IMAGE_STYLE, DEFAULT_SHAPE_STYLE } from "@/domain/entities";

export function createDefaultSlide(): Slide {
  return {
    id: crypto.randomUUID(),
    elements: [],
    background: "#ffffff",
  };
}

export function createTextElement(
  overrides?: Partial<SlideElement>
): SlideElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    x: 400,
    y: 300,
    width: 500,
    height: 100,
    rotation: 0,
    content: "Double-click to edit",
    style: { ...DEFAULT_TEXT_STYLE },
    zIndex: 1,
    ...overrides,
  };
}

export function createImageElement(
  dataUrl: string,
  overrides?: Partial<SlideElement>
): SlideElement {
  return {
    id: crypto.randomUUID(),
    type: "image",
    x: 400,
    y: 200,
    width: 500,
    height: 375,
    rotation: 0,
    content: dataUrl,
    style: { ...DEFAULT_IMAGE_STYLE },
    zIndex: 1,
    ...overrides,
  };
}

export function createShapeElement(
  shapeType: string = "rectangle",
  overrides?: Partial<SlideElement>
): SlideElement {
  return {
    id: crypto.randomUUID(),
    type: "shape",
    x: 600,
    y: 300,
    width: 200,
    height: 200,
    rotation: 0,
    content: shapeType,
    style: {
      ...DEFAULT_SHAPE_STYLE,
      borderRadius: shapeType === "circle" ? 9999 : 0,
    },
    zIndex: 1,
    ...overrides,
  };
}
