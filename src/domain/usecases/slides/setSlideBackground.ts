import type { Slide } from "@/domain/entities";

type Input = { slides: Slide[]; slideId: string; background: string };
type Output = { slides: Slide[] };

export function setSlideBackground({ slides, slideId, background }: Input): Output {
  return {
    slides: slides.map((s) =>
      s.id === slideId ? { ...s, background } : s
    ),
  };
}
