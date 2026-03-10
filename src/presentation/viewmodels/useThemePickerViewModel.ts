import { useSlideStore } from "@/data/store/useSlideStore";
import { THEMES, DEFAULT_BACKGROUNDS } from "@/domain/constants";
import type { Theme } from "@/domain/constants";
import { themeController } from "@/presentation/controllers/themeController";

export function useThemePickerViewModel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);

  const currentSlide = slides[currentSlideIndex];

  return {
    themes: THEMES,
    backgrounds: DEFAULT_BACKGROUNDS,
    currentBackground: currentSlide?.background,

    applyTheme(theme: Theme) {
      themeController.applyTheme(theme);
    },

    applyBackground(color: string) {
      if (currentSlide) {
        themeController.applyBackground(currentSlide.id, color);
      }
    },
  };
}
