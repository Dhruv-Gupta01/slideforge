import type { Slide, SlideElement } from "@/domain/entities";
import { getMaxZIndex, findElement } from "@/domain/entities";

type Input = { slides: Slide[]; slideIndex: number; elementId: string };
type Output = { slides: Slide[]; newElementId: string } | null;

export function duplicateElement({ slides, slideIndex, elementId }: Input): Output {
  const slide = slides[slideIndex];
  const element = findElement(slide, elementId);
  if (!element) return null;

  const maxZ = getMaxZIndex(slide.elements);
  const duplicate: SlideElement = {
    ...structuredClone(element),
    id: crypto.randomUUID(),
    x: element.x + 20,
    y: element.y + 20,
    zIndex: maxZ + 1,
  };

  return {
    slides: slides.map((s, i) =>
      i === slideIndex
        ? { ...s, elements: [...s.elements, duplicate] }
        : s
    ),
    newElementId: duplicate.id,
  };
}
