import { useSlideStore } from "@/data/store/useSlideStore";
import type { Theme } from "@/domain/constants";
import { applyTheme as applyThemeUseCase } from "@/domain/usecases/theme/applyTheme";
import { setSlideBackground } from "@/domain/usecases/slides/setSlideBackground";
import { historyController } from "./historyController";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const themeController = {
  applyTheme(theme: Theme) {
    const { slides, currentSlideIndex } = get();
    const result = applyThemeUseCase({ slides, slideIndex: currentSlideIndex, theme });
    set(result);
    historyController.push();
  },

  applyBackground(slideId: string, background: string) {
    const { slides } = get();
    const result = setSlideBackground({ slides, slideId, background });
    set(result);
    historyController.push();
  },
};
