import { useSlideStore } from "@/data/store/useSlideStore";
import { slideController } from "@/presentation/controllers/slideController";

export function useSlidePanelViewModel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);

  return {
    slides,
    currentSlideIndex,
    canDelete: slides.length > 1,

    addSlide: slideController.addSlide,
    deleteSlide: slideController.deleteSlide,
    setCurrentSlide: slideController.setCurrentSlide,
    reorderSlides: slideController.reorderSlides,
  };
}
