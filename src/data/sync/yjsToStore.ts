import type { Slide } from "@/domain/entities";
import { useSlideStore } from "@/data/store/useSlideStore";
import { getYSlides } from "./yjsDocument";
import { yMapToSlide } from "./storeToYjs";

let observerAttached = false;

function yDocToSlides(): Slide[] {
  const ySlides = getYSlides();
  const slides: Slide[] = [];
  for (let i = 0; i < ySlides.length; i++) {
    slides.push(yMapToSlide(ySlides.get(i)));
  }
  return slides;
}

function syncYDocToStore(): void {
  const slides = yDocToSlides();
  if (slides.length === 0) return;

  const state = useSlideStore.getState();
  const currentSlideIndex = Math.min(state.currentSlideIndex, slides.length - 1);

  useSlideStore.setState({
    slides,
    currentSlideIndex,
  });
}

export function attachYjsObserver(): void {
  if (observerAttached) return;
  observerAttached = true;

  const ySlides = getYSlides();
  ySlides.observeDeep(syncYDocToStore);
}

export function detachYjsObserver(): void {
  if (!observerAttached) return;
  observerAttached = false;

  const ySlides = getYSlides();
  ySlides.unobserveDeep(syncYDocToStore);
}

export function forceYDocToStoreSync(): void {
  syncYDocToStore();
}
