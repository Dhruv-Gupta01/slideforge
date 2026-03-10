import { useSlideStore } from "@/data/store/useSlideStore";
import { bringForward as bringForwardUseCase } from "@/domain/usecases/elements/bringForward";
import { sendBackward as sendBackwardUseCase } from "@/domain/usecases/elements/sendBackward";
import { historyController } from "./historyController";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { yUpdateElement } from "@/data/sync/storeToYjs";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const zOrderController = {
  bringForward(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = bringForwardUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      if (isCollabActive()) {
        const slide = result.slides[currentSlideIndex];
        for (const el of slide.elements) {
          const orig = slides[currentSlideIndex].elements.find((e) => e.id === el.id);
          if (orig && orig.zIndex !== el.zIndex) {
            yUpdateElement(slide.id, el.id, { zIndex: el.zIndex });
          }
        }
      } else {
        set(result);
        historyController.push();
      }
    }
  },

  sendBackward(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = sendBackwardUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      if (isCollabActive()) {
        const slide = result.slides[currentSlideIndex];
        for (const el of slide.elements) {
          const orig = slides[currentSlideIndex].elements.find((e) => e.id === el.id);
          if (orig && orig.zIndex !== el.zIndex) {
            yUpdateElement(slide.id, el.id, { zIndex: el.zIndex });
          }
        }
      } else {
        set(result);
        historyController.push();
      }
    }
  },
};
