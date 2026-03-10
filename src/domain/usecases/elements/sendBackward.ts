import type { Slide } from "@/domain/entities";
import { findElement } from "@/domain/entities";

type Input = { slides: Slide[]; slideIndex: number; elementId: string };
type Output = { slides: Slide[] } | null;

export function sendBackward({ slides, slideIndex, elementId }: Input): Output {
  const slide = slides[slideIndex];
  const element = findElement(slide, elementId);
  if (!element || element.zIndex <= 0) return null;

  return {
    slides: slides.map((s, i) =>
      i === slideIndex
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === elementId ? { ...e, zIndex: e.zIndex - 1 } : e
            ),
          }
        : s
    ),
  };
}
