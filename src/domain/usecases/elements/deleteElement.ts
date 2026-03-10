import type { Slide } from "@/domain/entities";

type Input = { slides: Slide[]; slideIndex: number; elementId: string };
type Output = { slides: Slide[] };

export function deleteElement({ slides, slideIndex, elementId }: Input): Output {
  return {
    slides: slides.map((s, i) =>
      i === slideIndex
        ? { ...s, elements: s.elements.filter((e) => e.id !== elementId) }
        : s
    ),
  };
}
