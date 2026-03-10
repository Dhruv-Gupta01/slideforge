import { useSlideStore } from "@/data/store/useSlideStore";
import { addSlide as addSlideUseCase } from "@/domain/usecases/slides/addSlide";
import { deleteSlide as deleteSlideUseCase } from "@/domain/usecases/slides/deleteSlide";
import { reorderSlides as reorderSlidesUseCase } from "@/domain/usecases/slides/reorderSlides";
import { setSlideBackground as setSlideBackgroundUseCase } from "@/domain/usecases/slides/setSlideBackground";
import { historyController } from "./historyController";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const slideController = {
  addSlide() {
    const { slides } = get();
    const result = addSlideUseCase({ slides });
    set({ slides: result.slides, currentSlideIndex: result.currentSlideIndex, selectedElementId: null });
    historyController.push();
  },

  deleteSlide(slideId: string) {
    const { slides, currentSlideIndex } = get();
    const result = deleteSlideUseCase({ slides, currentSlideIndex, slideId });
    if (result) {
      set({ ...result, selectedElementId: null });
      historyController.push();
    }
  },

  setCurrentSlide(index: number) {
    set({ currentSlideIndex: index, selectedElementId: null });
  },

  reorderSlides(fromIndex: number, toIndex: number) {
    const { slides } = get();
    const result = reorderSlidesUseCase({ slides, fromIndex, toIndex });
    set(result);
    historyController.push();
  },

  setSlideBackground(slideId: string, background: string) {
    const { slides } = get();
    const result = setSlideBackgroundUseCase({ slides, slideId, background });
    set(result);
    historyController.push();
  },
};
