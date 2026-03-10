import { useSlideStore } from "@/data/store/useSlideStore";
import { bringForward as bringForwardUseCase } from "@/domain/usecases/elements/bringForward";
import { sendBackward as sendBackwardUseCase } from "@/domain/usecases/elements/sendBackward";
import { historyController } from "./historyController";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const zOrderController = {
  bringForward(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = bringForwardUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      set(result);
      historyController.push();
    }
  },

  sendBackward(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = sendBackwardUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      set(result);
      historyController.push();
    }
  },
};
