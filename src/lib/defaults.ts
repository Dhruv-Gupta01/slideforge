import type { Slide, SlideElement } from "@/types";
import { generateId } from "./utils";

export const DEFAULT_BACKGROUNDS = [
  "#ffffff",
  "#1a1a2e",
  "#0f3460",
  "#16213e",
  "#f5f5f5",
  "#fdf6e3",
];

export const THEMES = [
  {
    name: "Light",
    slideBackground: "#ffffff",
    textColor: "#1a1a1a",
    accentColor: "#3b82f6",
  },
  {
    name: "Dark",
    slideBackground: "#1a1a2e",
    textColor: "#e2e8f0",
    accentColor: "#60a5fa",
  },
  {
    name: "Ocean",
    slideBackground: "#0f3460",
    textColor: "#e2e8f0",
    accentColor: "#00d2ff",
  },
  {
    name: "Warm",
    slideBackground: "#fdf6e3",
    textColor: "#3d3d3d",
    accentColor: "#e07a5f",
  },
];

export function createDefaultSlide(): Slide {
  return {
    id: generateId(),
    elements: [],
    background: "#ffffff",
  };
}

export function createTextElement(
  x: number = 400,
  y: number = 300
): SlideElement {
  return {
    id: generateId(),
    type: "text",
    x,
    y,
    width: 500,
    height: 100,
    rotation: 0,
    content: "Double-click to edit",
    style: {
      fontSize: 32,
      fontWeight: "normal",
      color: "#1a1a1a",
      backgroundColor: "transparent",
      textAlign: "center",
    },
    zIndex: 1,
  };
}

export function createImageElement(
  dataUrl: string,
  x: number = 400,
  y: number = 200
): SlideElement {
  return {
    id: generateId(),
    type: "image",
    x,
    y,
    width: 500,
    height: 375,
    rotation: 0,
    content: dataUrl,
    style: {
      opacity: 1,
      borderRadius: 0,
    },
    zIndex: 1,
  };
}

export function createShapeElement(
  shapeType: string = "rectangle",
  x: number = 600,
  y: number = 300
): SlideElement {
  return {
    id: generateId(),
    type: "shape",
    x,
    y,
    width: 200,
    height: 200,
    rotation: 0,
    content: shapeType,
    style: {
      backgroundColor: "#3b82f6",
      borderRadius: shapeType === "circle" ? 9999 : 0,
      opacity: 1,
    },
    zIndex: 1,
  };
}
