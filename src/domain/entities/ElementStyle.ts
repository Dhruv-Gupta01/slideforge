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

export const DEFAULT_TEXT_STYLE: ElementStyle = {
  fontSize: 32,
  fontWeight: "normal",
  color: "#1a1a1a",
  backgroundColor: "transparent",
  textAlign: "center",
};

export const DEFAULT_IMAGE_STYLE: ElementStyle = {
  opacity: 1,
  borderRadius: 0,
};

export const DEFAULT_SHAPE_STYLE: ElementStyle = {
  backgroundColor: "#3b82f6",
  opacity: 1,
};
