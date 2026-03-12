import * as Y from "yjs";
import type { Slide, SlideElement, ElementStyle } from "@/domain/entities";
import { getYDoc, getYSlides, getYSlideAt, getYElements, getYStyle } from "./yjsDocument";

function elementToYMap(element: SlideElement): Y.Map<unknown> {
  const map = new Y.Map<unknown>();
  map.set("id", element.id);
  map.set("type", element.type);
  map.set("x", element.x);
  map.set("y", element.y);
  map.set("width", element.width);
  map.set("height", element.height);
  map.set("rotation", element.rotation);
  map.set("content", element.content);
  map.set("zIndex", element.zIndex);

  const styleMap = new Y.Map<unknown>();
  if (element.style) {
    for (const [key, value] of Object.entries(element.style)) {
      if (value !== undefined) {
        styleMap.set(key, value);
      }
    }
  }
  map.set("style", styleMap);

  return map;
}

function slideToYMap(slide: Slide): Y.Map<unknown> {
  const map = new Y.Map<unknown>();
  map.set("id", slide.id);
  map.set("background", slide.background);

  const elementsArray = new Y.Array<Y.Map<unknown>>();
  for (const element of slide.elements) {
    elementsArray.push([elementToYMap(element)]);
  }
  map.set("elements", elementsArray);

  return map;
}

export function initYDocFromStore(slides: Slide[]): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    if (ySlides.length > 0) {
      ySlides.delete(0, ySlides.length);
    }
    for (const slide of slides) {
      ySlides.push([slideToYMap(slide)]);
    }
  });
}

export function yAddElement(slideIndex: number, element: SlideElement): void {
  const doc = getYDoc();
  doc.transact(() => {
    const slideMap = getYSlideAt(slideIndex);
    if (!slideMap) return;
    const elements = getYElements(slideMap);
    elements.push([elementToYMap(element)]);
  });
}

export function yUpdateElement(
  slideId: string,
  elementId: string,
  updates: Partial<SlideElement>
): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    for (let i = 0; i < ySlides.length; i++) {
      const slideMap = ySlides.get(i);
      if (slideMap.get("id") !== slideId) continue;

      const elements = getYElements(slideMap);
      for (let j = 0; j < elements.length; j++) {
        const elMap = elements.get(j);
        if (elMap.get("id") !== elementId) continue;

        for (const [key, value] of Object.entries(updates)) {
          if (key === "style") continue;
          elMap.set(key, value);
        }
        return;
      }
    }
  });
}

export function yUpdateElementStyle(
  slideId: string,
  elementId: string,
  styleUpdates: Partial<ElementStyle>
): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    for (let i = 0; i < ySlides.length; i++) {
      const slideMap = ySlides.get(i);
      if (slideMap.get("id") !== slideId) continue;

      const elements = getYElements(slideMap);
      for (let j = 0; j < elements.length; j++) {
        const elMap = elements.get(j);
        if (elMap.get("id") !== elementId) continue;

        const style = getYStyle(elMap);
        for (const [key, value] of Object.entries(styleUpdates)) {
          style.set(key, value);
        }
        return;
      }
    }
  });
}

export function yDeleteElement(slideIndex: number, elementId: string): void {
  const doc = getYDoc();
  doc.transact(() => {
    const slideMap = getYSlideAt(slideIndex);
    if (!slideMap) return;
    const elements = getYElements(slideMap);
    for (let i = 0; i < elements.length; i++) {
      if (elements.get(i).get("id") === elementId) {
        elements.delete(i, 1);
        return;
      }
    }
  });
}

export function yAddSlide(slide: Slide): void {
  const doc = getYDoc();
  doc.transact(() => {
    getYSlides().push([slideToYMap(slide)]);
  });
}

export function yDeleteSlide(slideId: string): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    for (let i = 0; i < ySlides.length; i++) {
      if (ySlides.get(i).get("id") === slideId) {
        ySlides.delete(i, 1);
        return;
      }
    }
  });
}

export function yReorderSlides(fromIndex: number, toIndex: number): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    if (fromIndex < 0 || fromIndex >= ySlides.length) return;
    if (toIndex < 0 || toIndex >= ySlides.length) return;

    const slideMap = ySlides.get(fromIndex);
    const cloned = slideToYMap(yMapToSlide(slideMap));
    ySlides.delete(fromIndex, 1);
    ySlides.insert(toIndex, [cloned]);
  });
}

export function ySetSlideBackground(slideId: string, background: string): void {
  const doc = getYDoc();
  doc.transact(() => {
    const ySlides = getYSlides();
    for (let i = 0; i < ySlides.length; i++) {
      const slideMap = ySlides.get(i);
      if (slideMap.get("id") === slideId) {
        slideMap.set("background", background);
        return;
      }
    }
  });
}

function yMapToSlide(slideMap: Y.Map<unknown>): Slide {
  const elements = getYElements(slideMap);
  const slideElements: SlideElement[] = [];

  for (let i = 0; i < elements.length; i++) {
    const elMap = elements.get(i);
    const styleMap = getYStyle(elMap);
    const style: ElementStyle = {};
    if (styleMap) {
      styleMap.forEach((value, key) => {
        (style as Record<string, unknown>)[key] = value;
      });
    }

    slideElements.push({
      id: elMap.get("id") as string,
      type: elMap.get("type") as SlideElement["type"],
      x: elMap.get("x") as number,
      y: elMap.get("y") as number,
      width: elMap.get("width") as number,
      height: elMap.get("height") as number,
      rotation: elMap.get("rotation") as number,
      content: elMap.get("content") as string,
      zIndex: elMap.get("zIndex") as number,
      style,
    });
  }

  return {
    id: slideMap.get("id") as string,
    elements: slideElements,
    background: slideMap.get("background") as string,
  };
}

export { yMapToSlide };
