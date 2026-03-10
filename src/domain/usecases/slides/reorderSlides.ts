import type { Slide } from "@/domain/entities";

type Input = { slides: Slide[]; fromIndex: number; toIndex: number };
type Output = { slides: Slide[]; currentSlideIndex: number };

export function reorderSlides({ slides, fromIndex, toIndex }: Input): Output {
  const newSlides = [...slides];
  const [moved] = newSlides.splice(fromIndex, 1);
  newSlides.splice(toIndex, 0, moved);
  return { slides: newSlides, currentSlideIndex: toIndex };
}
