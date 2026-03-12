import { useSlideStore } from "@/data/store/useSlideStore";
import { addSlide as addSlideUseCase } from "@/domain/usecases/slides/addSlide";
import { deleteSlide as deleteSlideUseCase } from "@/domain/usecases/slides/deleteSlide";
import { reorderSlides as reorderSlidesUseCase } from "@/domain/usecases/slides/reorderSlides";
import { setSlideBackground as setSlideBackgroundUseCase } from "@/domain/usecases/slides/setSlideBackground";
import { historyController } from "./historyController";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { yAddSlide, yDeleteSlide, yReorderSlides, ySetSlideBackground } from "@/data/sync/storeToYjs";
import { createDefaultSlide } from "@/domain/factories/elementFactory";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const slideController = {
  addSlide() {
    if (isCollabActive()) {
      const slide = createDefaultSlide();
      yAddSlide(slide);
      const { slides } = get();
      set({ currentSlideIndex: slides.length - 1, selectedElementId: null });
    } else {
      const { slides } = get();
      const result = addSlideUseCase({ slides });
      set({ slides: result.slides, currentSlideIndex: result.currentSlideIndex, selectedElementId: null });
      historyController.push();
    }
  },

  deleteSlide(slideId: string) {
    const { slides } = get();
    if (slides.length <= 1) return;

    if (isCollabActive()) {
      const { currentSlideIndex } = get();
      yDeleteSlide(slideId);
      const newIndex = Math.min(currentSlideIndex, slides.length - 2);
      set({ currentSlideIndex: newIndex, selectedElementId: null });
    } else {
      const { currentSlideIndex } = get();
      const result = deleteSlideUseCase({ slides, currentSlideIndex, slideId });
      if (result) {
        set({ ...result, selectedElementId: null });
        historyController.push();
      }
    }
  },

  setCurrentSlide(index: number) {
    set({ currentSlideIndex: index, selectedElementId: null });
  },

  reorderSlides(fromIndex: number, toIndex: number) {
    if (isCollabActive()) {
      yReorderSlides(fromIndex, toIndex);
      set({ currentSlideIndex: toIndex });
    } else {
      const { slides } = get();
      const result = reorderSlidesUseCase({ slides, fromIndex, toIndex });
      set(result);
      historyController.push();
    }
  },

  setSlideBackground(slideId: string, background: string) {
    if (isCollabActive()) {
      ySetSlideBackground(slideId, background);
    } else {
      const { slides } = get();
      const result = setSlideBackgroundUseCase({ slides, slideId, background });
      set(result);
      historyController.push();
    }
  },
};
