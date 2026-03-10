import type { Slide } from "@/domain/entities";
import type { Theme } from "@/domain/constants";

type Input = { slides: Slide[]; slideIndex: number; theme: Theme };
type Output = { slides: Slide[] };

export function applyTheme({ slides, slideIndex, theme }: Input): Output {
  return {
    slides: slides.map((s, i) => {
      if (i !== slideIndex) return s;
      return {
        ...s,
        background: theme.slideBackground,
        elements: s.elements.map((el) =>
          el.type === "text"
            ? { ...el, style: { ...el.style, color: theme.textColor } }
            : el
        ),
      };
    }),
  };
}
