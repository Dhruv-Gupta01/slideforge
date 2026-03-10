import { useSlideStore } from "@/data/store/useSlideStore";
import type { Theme } from "@/domain/constants";
import { applyTheme as applyThemeUseCase } from "@/domain/usecases/theme/applyTheme";
import { setSlideBackground } from "@/domain/usecases/slides/setSlideBackground";
import { historyController } from "./historyController";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { ySetSlideBackground, yUpdateElementStyle } from "@/data/sync/storeToYjs";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const themeController = {
  applyTheme(theme: Theme) {
    const { slides, currentSlideIndex } = get();

    if (isCollabActive()) {
      const slide = slides[currentSlideIndex];
      if (!slide) return;
      ySetSlideBackground(slide.id, theme.slideBackground);
      for (const el of slide.elements) {
        if (el.type === "text") {
          yUpdateElementStyle(slide.id, el.id, { color: theme.textColor });
        }
      }
    } else {
      const result = applyThemeUseCase({ slides, slideIndex: currentSlideIndex, theme });
      set(result);
      historyController.push();
    }
  },

  applyBackground(slideId: string, background: string) {
    if (isCollabActive()) {
      ySetSlideBackground(slideId, background);
    } else {
      const { slides } = get();
      const result = setSlideBackground({ slides, slideId, background });
      set(result);
      historyController.push();
    }
  },
};
