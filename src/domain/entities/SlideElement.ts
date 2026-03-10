import type { ElementStyle } from "./ElementStyle";

export type ElementType = "text" | "image" | "shape";
export type ShapeType = "rectangle" | "circle" | "triangle";

export type SlideElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: ElementStyle;
  zIndex: number;
};

export function isTextElement(el: SlideElement): boolean {
  return el.type === "text";
}

export function isImageElement(el: SlideElement): boolean {
  return el.type === "image";
}

export function isShapeElement(el: SlideElement): boolean {
  return el.type === "shape";
}
