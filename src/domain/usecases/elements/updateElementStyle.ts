import type { Slide, ElementStyle } from "@/domain/entities";

type Input = {
  slides: Slide[];
  slideId: string;
  elementId: string;
  styleUpdates: Partial<ElementStyle>;
};
type Output = { slides: Slide[] };

export function updateElementStyle({ slides, slideId, elementId, styleUpdates }: Input): Output {
  return {
    slides: slides.map((s) =>
      s.id === slideId
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === elementId
                ? { ...e, style: { ...e.style, ...styleUpdates } }
                : e
            ),
          }
        : s
    ),
  };
}
