type Input = { currentSlideIndex: number; totalSlides: number; direction: "next" | "prev" };
type Output = { currentSlideIndex: number } | null;

export function navigateSlide({ currentSlideIndex, totalSlides, direction }: Input): Output {
  if (direction === "next" && currentSlideIndex < totalSlides - 1) {
    return { currentSlideIndex: currentSlideIndex + 1 };
  }
  if (direction === "prev" && currentSlideIndex > 0) {
    return { currentSlideIndex: currentSlideIndex - 1 };
  }
  return null;
}
