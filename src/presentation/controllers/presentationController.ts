import { useSlideStore } from "@/data/store/useSlideStore";
import { navigateSlide } from "@/domain/usecases/presentation/navigateSlide";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const presentationController = {
  start() {
    set({ isPresenting: true, selectedElementId: null });
  },

  stop() {
    set({ isPresenting: false });
  },

  nextSlide() {
    const { currentSlideIndex, slides } = get();
    const result = navigateSlide({
      currentSlideIndex,
      totalSlides: slides.length,
      direction: "next",
    });
    if (result) set(result);
  },

  prevSlide() {
    const { currentSlideIndex, slides } = get();
    const result = navigateSlide({
      currentSlideIndex,
      totalSlides: slides.length,
      direction: "prev",
    });
    if (result) set(result);
  },
};
