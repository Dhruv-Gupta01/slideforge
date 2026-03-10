import { useSlideStore } from "@/data/store/useSlideStore";
import type { ElementStyle } from "@/domain/entities";
import { styleController } from "@/presentation/controllers/styleController";
import { zOrderController } from "@/presentation/controllers/zOrderController";

export function useStylePanelViewModel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  const currentSlide = slides[currentSlideIndex];
  const element = currentSlide?.elements.find((e) => e.id === selectedElementId);

  const slideId = currentSlide?.id;
  const elementId = element?.id;

  return {
    element,
    style: element?.style ?? ({} as ElementStyle),
    isText: element?.type === "text",
    isShapeOrImage: element?.type === "shape" || element?.type === "image",

    updateStyle(updates: Partial<ElementStyle>) {
      if (slideId && elementId) {
        styleController.updateStyle(slideId, elementId, updates);
      }
    },

    updateStyleAndSave(updates: Partial<ElementStyle>) {
      if (slideId && elementId) {
        styleController.updateStyleAndSave(slideId, elementId, updates);
      }
    },

    pushHistory() {
      styleController.pushHistory();
    },

    bringForward() {
      if (elementId) zOrderController.bringForward(elementId);
    },

    sendBackward() {
      if (elementId) zOrderController.sendBackward(elementId);
    },
  };
}
