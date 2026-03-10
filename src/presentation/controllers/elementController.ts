import { useSlideStore } from "@/data/store/useSlideStore";
import type { SlideElement } from "@/domain/entities";
import { getMaxZIndex } from "@/domain/entities";
import { createTextElement, createImageElement, createShapeElement } from "@/domain/factories/elementFactory";
import { addElement } from "@/domain/usecases/elements/addElement";
import { deleteElement as deleteElementUseCase } from "@/domain/usecases/elements/deleteElement";
import { updateElement as updateElementUseCase } from "@/domain/usecases/elements/updateElement";
import { duplicateElement as duplicateElementUseCase } from "@/domain/usecases/elements/duplicateElement";
import { historyController } from "./historyController";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const elementController = {
  addText() {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createTextElement({ zIndex: maxZ + 1 });
    const result = addElement({ slides, slideIndex: currentSlideIndex, element });
    set({ ...result, selectedElementId: element.id });
    historyController.push();
  },

  addImage(dataUrl: string) {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createImageElement(dataUrl, { zIndex: maxZ + 1 });
    const result = addElement({ slides, slideIndex: currentSlideIndex, element });
    set({ ...result, selectedElementId: element.id });
    historyController.push();
  },

  addShape(shapeType: string) {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createShapeElement(shapeType, { zIndex: maxZ + 1 });
    const result = addElement({ slides, slideIndex: currentSlideIndex, element });
    set({ ...result, selectedElementId: element.id });
    historyController.push();
  },

  updateElement(slideId: string, elementId: string, updates: Partial<SlideElement>) {
    const { slides } = get();
    const result = updateElementUseCase({ slides, slideId, elementId, updates });
    set(result);
  },

  deleteElement(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = deleteElementUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    set({ ...result, selectedElementId: null });
    historyController.push();
  },

  selectElement(elementId: string | null) {
    set({ selectedElementId: elementId });
  },

  duplicateElement(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = duplicateElementUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      set({ slides: result.slides, selectedElementId: result.newElementId });
      historyController.push();
    }
  },
};
