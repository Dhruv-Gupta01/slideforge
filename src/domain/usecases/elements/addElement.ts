import type { Slide, SlideElement } from "@/domain/entities";

type Input = { slides: Slide[]; slideIndex: number; element: SlideElement };
type Output = { slides: Slide[] };

export function addElement({ slides, slideIndex, element }: Input): Output {
  return {
    slides: slides.map((s, i) =>
      i === slideIndex
        ? { ...s, elements: [...s.elements, element] }
        : s
    ),
  };
}
