export type { ElementStyle } from "./ElementStyle";
export { DEFAULT_TEXT_STYLE, DEFAULT_IMAGE_STYLE, DEFAULT_SHAPE_STYLE } from "./ElementStyle";

export type { SlideElement, ElementType, ShapeType } from "./SlideElement";
export { isTextElement, isImageElement, isShapeElement } from "./SlideElement";

export type { Slide } from "./Slide";
export { canDeleteSlide, getMaxZIndex, findElement } from "./Slide";

export type { HistoryState } from "./History";

export type { CollabUser } from "./CollabUser";
export { getRandomUserColor } from "./CollabUser";
