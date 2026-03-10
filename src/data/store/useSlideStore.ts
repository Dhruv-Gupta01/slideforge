import { create } from "zustand";
import type { Slide } from "@/domain/entities";
import { createDefaultSlide } from "@/domain/factories/elementFactory";

export interface StoreState {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementId: string | null;
  isPresenting: boolean;
  history: Slide[][];
  historyIndex: number;
}

const initialSlide = createDefaultSlide();

export const useSlideStore = create<StoreState>(() => ({
  slides: [initialSlide],
  currentSlideIndex: 0,
  selectedElementId: null,
  isPresenting: false,
  history: [[initialSlide]],
  historyIndex: 0,
}));
