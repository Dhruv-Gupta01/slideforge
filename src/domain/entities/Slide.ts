import type { SlideElement } from "./SlideElement";

export type Slide = {
  id: string;
  elements: SlideElement[];
  background: string;
};

export function canDeleteSlide(totalSlides: number): boolean {
  return totalSlides > 1;
}

export function getMaxZIndex(elements: SlideElement[]): number {
  return elements.length === 0
    ? 0
    : Math.max(...elements.map((e) => e.zIndex));
}

export function findElement(
  slide: Slide,
  elementId: string
): SlideElement | undefined {
  return slide.elements.find((e) => e.id === elementId);
}
