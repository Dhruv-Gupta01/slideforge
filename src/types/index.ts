export type ShapeType = "rectangle" | "circle" | "triangle";

export type ElementStyle = {
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  textAlign?: "left" | "center" | "right";
};

export type SlideElement = {
  id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: ElementStyle;
  zIndex: number;
};

export type Slide = {
  id: string;
  elements: SlideElement[];
  background: string;
};

export type Presentation = {
  slides: Slide[];
  currentSlideIndex: number;
  isPresenting: boolean;
  selectedElementId: string | null;
};
