import type { Slide, SlideElement } from "@/domain/entities";

type Input = {
  slides: Slide[];
  slideId: string;
  elementId: string;
  updates: Partial<SlideElement>;
};
type Output = { slides: Slide[] };

export function updateElement({ slides, slideId, elementId, updates }: Input): Output {
  return {
    slides: slides.map((s) =>
      s.id === slideId
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === elementId ? { ...e, ...updates } : e
            ),
          }
        : s
    ),
  };
}
