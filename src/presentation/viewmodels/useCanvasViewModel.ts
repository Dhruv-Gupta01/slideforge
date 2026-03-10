import { useSlideStore } from "@/data/store/useSlideStore";
import type { Slide, SlideElement } from "@/domain/entities";
import { elementController } from "@/presentation/controllers/elementController";
import { historyController } from "@/presentation/controllers/historyController";

export function useCanvasViewModel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  const currentSlide: Slide | undefined = slides[currentSlideIndex];

  return {
    currentSlide,
    selectedElementId,

    isElementSelected(elementId: string): boolean {
      return selectedElementId === elementId;
    },

    selectElement: elementController.selectElement,

    deselectAll() {
      elementController.selectElement(null);
    },

    updateElement(slideId: string, elementId: string, updates: Partial<SlideElement>) {
      elementController.updateElement(slideId, elementId, updates);
    },

    pushHistory: historyController.push,
  };
}
