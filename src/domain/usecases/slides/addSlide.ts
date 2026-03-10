import type { Slide } from "@/domain/entities";
import { createDefaultSlide } from "@/domain/factories/elementFactory";

type Input = { slides: Slide[] };
type Output = { slides: Slide[]; currentSlideIndex: number; newSlide: Slide };

export function addSlide({ slides }: Input): Output {
  const newSlide = createDefaultSlide();
  return {
    slides: [...slides, newSlide],
    currentSlideIndex: slides.length,
    newSlide,
  };
}
