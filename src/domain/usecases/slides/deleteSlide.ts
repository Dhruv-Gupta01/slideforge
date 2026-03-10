import type { Slide } from "@/domain/entities";
import { canDeleteSlide } from "@/domain/entities";

type Input = { slides: Slide[]; currentSlideIndex: number; slideId: string };
type Output = { slides: Slide[]; currentSlideIndex: number } | null;

export function deleteSlide({ slides, currentSlideIndex, slideId }: Input): Output {
  if (!canDeleteSlide(slides.length)) return null;

  const newSlides = slides.filter((s) => s.id !== slideId);
  const newIndex = Math.min(currentSlideIndex, newSlides.length - 1);
  return { slides: newSlides, currentSlideIndex: newIndex };
}
