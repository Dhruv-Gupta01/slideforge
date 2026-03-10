import { useSlideStore } from "@/data/store/useSlideStore";
import { presentationController } from "@/presentation/controllers/presentationController";

export function usePresentationViewModel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const isPresenting = useSlideStore((s) => s.isPresenting);

  const currentSlide = slides[currentSlideIndex];

  return {
    slides,
    currentSlide,
    currentSlideIndex,
    isPresenting,
    totalSlides: slides.length,

    stop: presentationController.stop,
    nextSlide: presentationController.nextSlide,
    prevSlide: presentationController.prevSlide,
  };
}
