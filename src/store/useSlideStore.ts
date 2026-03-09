import { create } from "zustand";
import type { Slide, SlideElement } from "@/types";
import {
  createDefaultSlide,
  createTextElement,
  createImageElement,
  createShapeElement,
} from "@/lib/defaults";

interface SlideStore {
  // State
  slides: Slide[];
  currentSlideIndex: number;
  isPresenting: boolean;
  selectedElementId: string | null;

  // Slide actions
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  setCurrentSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  setSlideBackground: (slideId: string, background: string) => void;

  // Element actions
  addTextElement: () => void;
  addImageElement: (dataUrl: string) => void;
  addShapeElement: (shapeType: string) => void;
  updateElement: (
    slideId: string,
    elementId: string,
    updates: Partial<SlideElement>
  ) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  bringForward: (elementId: string) => void;
  sendBackward: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;

  // Presentation actions
  startPresenting: () => void;
  stopPresenting: () => void;
  nextSlide: () => void;
  prevSlide: () => void;

  // History (undo/redo)
  history: Slide[][];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const initialSlide = createDefaultSlide();

export const useSlideStore = create<SlideStore>((set, get) => ({
  // Initial state
  slides: [initialSlide],
  currentSlideIndex: 0,
  isPresenting: false,
  selectedElementId: null,

  // History
  history: [[initialSlide]],
  historyIndex: 0,

  pushHistory: () => {
    const { slides, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(slides)));
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        slides: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex,
        selectedElementId: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        slides: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex,
        selectedElementId: null,
      });
    }
  },

  // Slide actions
  addSlide: () => {
    const { slides } = get();
    const newSlide = createDefaultSlide();
    set({
      slides: [...slides, newSlide],
      currentSlideIndex: slides.length,
      selectedElementId: null,
    });
    get().pushHistory();
  },

  deleteSlide: (id: string) => {
    const { slides, currentSlideIndex } = get();
    if (slides.length <= 1) return;
    const newSlides = slides.filter((s) => s.id !== id);
    const newIndex = Math.min(currentSlideIndex, newSlides.length - 1);
    set({
      slides: newSlides,
      currentSlideIndex: newIndex,
      selectedElementId: null,
    });
    get().pushHistory();
  },

  setCurrentSlide: (index: number) => {
    set({ currentSlideIndex: index, selectedElementId: null });
  },

  reorderSlides: (fromIndex: number, toIndex: number) => {
    const { slides } = get();
    const newSlides = [...slides];
    const [moved] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, moved);
    set({ slides: newSlides, currentSlideIndex: toIndex });
    get().pushHistory();
  },

  setSlideBackground: (slideId: string, background: string) => {
    const { slides } = get();
    set({
      slides: slides.map((s) =>
        s.id === slideId ? { ...s, background } : s
      ),
    });
    get().pushHistory();
  },

  // Element actions
  addTextElement: () => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const newElement = createTextElement();
    const maxZ = Math.max(0, ...currentSlide.elements.map((e) => e.zIndex));
    newElement.zIndex = maxZ + 1;
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    );
    set({ slides: newSlides, selectedElementId: newElement.id });
    get().pushHistory();
  },

  addImageElement: (dataUrl: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const newElement = createImageElement(dataUrl);
    const maxZ = Math.max(0, ...currentSlide.elements.map((e) => e.zIndex));
    newElement.zIndex = maxZ + 1;
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    );
    set({ slides: newSlides, selectedElementId: newElement.id });
    get().pushHistory();
  },

  addShapeElement: (shapeType: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const newElement = createShapeElement(shapeType);
    const maxZ = Math.max(0, ...currentSlide.elements.map((e) => e.zIndex));
    newElement.zIndex = maxZ + 1;
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    );
    set({ slides: newSlides, selectedElementId: newElement.id });
    get().pushHistory();
  },

  updateElement: (
    slideId: string,
    elementId: string,
    updates: Partial<SlideElement>
  ) => {
    const { slides } = get();
    set({
      slides: slides.map((s) =>
        s.id === slideId
          ? {
              ...s,
              elements: s.elements.map((e) =>
                e.id === elementId ? { ...e, ...updates } : e
              ),
            }
          : s
      ),
    });
  },

  deleteElement: (elementId: string) => {
    const { slides, currentSlideIndex } = get();
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? { ...s, elements: s.elements.filter((e) => e.id !== elementId) }
        : s
    );
    set({ slides: newSlides, selectedElementId: null });
    get().pushHistory();
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  bringForward: (elementId: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const element = currentSlide.elements.find((e) => e.id === elementId);
    if (!element) return;
    const maxZ = Math.max(...currentSlide.elements.map((e) => e.zIndex));
    if (element.zIndex >= maxZ) return;
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === elementId ? { ...e, zIndex: e.zIndex + 1 } : e
            ),
          }
        : s
    );
    set({ slides: newSlides });
    get().pushHistory();
  },

  sendBackward: (elementId: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const element = currentSlide.elements.find((e) => e.id === elementId);
    if (!element || element.zIndex <= 0) return;
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === elementId ? { ...e, zIndex: e.zIndex - 1 } : e
            ),
          }
        : s
    );
    set({ slides: newSlides });
    get().pushHistory();
  },

  duplicateElement: (elementId: string) => {
    const { slides, currentSlideIndex } = get();
    const currentSlide = slides[currentSlideIndex];
    const element = currentSlide.elements.find((e) => e.id === elementId);
    if (!element) return;
    const maxZ = Math.max(...currentSlide.elements.map((e) => e.zIndex));
    const duplicate: SlideElement = {
      ...JSON.parse(JSON.stringify(element)),
      id: crypto.randomUUID(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: maxZ + 1,
    };
    const newSlides = slides.map((s, i) =>
      i === currentSlideIndex
        ? { ...s, elements: [...s.elements, duplicate] }
        : s
    );
    set({ slides: newSlides, selectedElementId: duplicate.id });
    get().pushHistory();
  },

  // Presentation actions
  startPresenting: () => {
    set({ isPresenting: true, selectedElementId: null });
  },

  stopPresenting: () => {
    set({ isPresenting: false });
  },

  nextSlide: () => {
    const { currentSlideIndex, slides } = get();
    if (currentSlideIndex < slides.length - 1) {
      set({ currentSlideIndex: currentSlideIndex + 1 });
    }
  },

  prevSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1 });
    }
  },
}));
